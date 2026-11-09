import "server-only";

import {
  leadProductLabels,
  type LeadRequest,
} from "./lead-schema";
import { describeSource } from "./source";

/**
 * Intégration HubSpot — exécutée uniquement côté serveur.
 *
 * Deux modes, activés par variables d'environnement (voir docs/HUBSPOT.md) :
 *  - "crm"   : HUBSPOT_ACCESS_TOKEN (application privée) → création / mise à
 *              jour du contact + note contenant le diagnostic.
 *  - "forms" : HUBSPOT_PORTAL_ID + HUBSPOT_FORM_GUID → soumission d'un
 *              formulaire HubSpot (consentements RGPD natifs).
 *  - sinon   : mode démonstration — rien n'est transmis.
 */

export type HubspotMode = "crm" | "forms" | "demo";

const API = "https://api.hubapi.com";
const FORMS_API = "https://api.hsforms.com/submissions/v3/integration/submit";
const PREFIX = process.env.HUBSPOT_PROPERTY_PREFIX ?? "voiland_";

export function getHubspotMode(): HubspotMode {
  if (process.env.HUBSPOT_ACCESS_TOKEN) return "crm";
  if (process.env.HUBSPOT_PORTAL_ID && process.env.HUBSPOT_FORM_GUID)
    return "forms";
  return "demo";
}

export type LeadContext = {
  reference: string;
  receivedAt: Date;
  ipAddress?: string;
  hutk?: string;
};

export function buildDiagnosticText(lead: LeadRequest) {
  const lines = lead.diagnostic.map((d) => `• ${d.label} : ${d.value}`);
  if (lead.message) lines.push(`• Message : ${lead.message}`);
  return lines.join("\n");
}

/** Propriétés personnalisées à créer dans HubSpot (groupe « Voiland »). */
export function buildCustomProperties(lead: LeadRequest, ctx: LeadContext) {
  const t = lead.tracking;
  return {
    [`${PREFIX}produit`]: leadProductLabels[lead.product],
    [`${PREFIX}objectif`]: lead.objective ?? "",
    [`${PREFIX}source_trafic`]: describeSource(t),
    [`${PREFIX}utm_source`]: t.utm_source ?? "",
    [`${PREFIX}utm_medium`]: t.utm_medium ?? "",
    [`${PREFIX}utm_campaign`]: t.utm_campaign ?? "",
    [`${PREFIX}utm_term`]: t.utm_term ?? "",
    [`${PREFIX}utm_content`]: t.utm_content ?? "",
    [`${PREFIX}page_conversion`]: t.pageUri ?? "",
    [`${PREFIX}creneau_rappel`]: lead.contact.callbackSlot,
    [`${PREFIX}diagnostic`]: buildDiagnosticText(lead).slice(0, 65000),
    [`${PREFIX}consentement_marketing`]: lead.consents.marketing
      ? "true"
      : "false",
    [`${PREFIX}date_demande`]: ctx.receivedAt.toISOString(),
    [`${PREFIX}reference`]: ctx.reference,
  };
}

async function hs<T>(
  path: string,
  init: RequestInit & { json?: unknown },
): Promise<{ status: number; data: T }> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: init.json ? JSON.stringify(init.json) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { status: res.status, data };
}

type HsError = { message?: string; category?: string };

async function upsertContact(
  standard: Record<string, string>,
  custom: Record<string, string>,
): Promise<string> {
  const attempt = async (properties: Record<string, string>) => {
    const created = await hs<{ id?: string } & HsError>(
      "/crm/v3/objects/contacts",
      {
        method: "POST",
        json: {
          properties: {
            ...properties,
            hs_lead_status: "NEW",
            lifecyclestage: "lead",
          },
        },
      },
    );
    if (created.status === 201 && created.data.id) return created;

    if (created.status === 409) {
      const match = /Existing ID:\s*(\d+)/.exec(created.data.message ?? "");
      if (!match) throw new Error("HubSpot: conflit sans identifiant");
      const id = match[1];
      // Mise à jour sans rétrograder le statut / cycle de vie existant.
      const updated = await hs<HsError>(`/crm/v3/objects/contacts/${id}`, {
        method: "PATCH",
        json: { properties },
      });
      if (updated.status >= 300) return { ...updated, data: updated.data };
      return { status: 200, data: { id } };
    }
    return created;
  };

  let result = await attempt({ ...standard, ...custom });
  if (
    result.status === 400 &&
    /PROPERTY_DOESNT_EXIST|does not exist/i.test(
      JSON.stringify(result.data ?? {}),
    )
  ) {
    console.warn(
      "[hubspot] Propriétés personnalisées absentes — envoi des propriétés standard uniquement. Créez-les (docs/HUBSPOT.md).",
    );
    result = await attempt(standard);
  }
  const id = (result.data as { id?: string }).id;
  if (!id) {
    throw new Error(
      `HubSpot contact: HTTP ${result.status} ${(result.data as HsError).category ?? ""}`,
    );
  }
  return id;
}

async function createNote(contactId: string, body: string, at: Date) {
  const res = await hs<HsError>("/crm/v3/objects/notes", {
    method: "POST",
    json: {
      properties: { hs_timestamp: at.toISOString(), hs_note_body: body },
      associations: [
        {
          to: { id: contactId },
          // 202 = association native note → contact
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
        },
      ],
    },
  });
  if (res.status >= 300) {
    // La note est un complément : on ne bloque pas la demande.
    console.warn(`[hubspot] Note non créée (HTTP ${res.status}).`);
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendViaCrm(lead: LeadRequest, ctx: LeadContext) {
  const standard = {
    firstname: lead.contact.firstName,
    lastname: lead.contact.lastName,
    email: lead.contact.email.toLowerCase(),
    phone: lead.contact.phone,
  };
  const contactId = await upsertContact(
    standard,
    buildCustomProperties(lead, ctx),
  );
  const noteBody = [
    `<p><strong>${escapeHtml(leadProductLabels[lead.product])}</strong> — demande ${escapeHtml(ctx.reference)}</p>`,
    lead.objective ? `<p>Objectif : ${escapeHtml(lead.objective)}</p>` : "",
    `<p>${escapeHtml(buildDiagnosticText(lead)).replace(/\n/g, "<br/>")}</p>`,
    `<p>Source : ${escapeHtml(describeSource(lead.tracking))} · Rappel : ${escapeHtml(lead.contact.callbackSlot)}</p>`,
    `<p><em>Résultats de simulateurs indicatifs, saisis par le prospect.</em></p>`,
  ].join("");
  await createNote(contactId, noteBody, ctx.receivedAt);
}

async function sendViaForms(lead: LeadRequest, ctx: LeadContext) {
  const portalId = process.env.HUBSPOT_PORTAL_ID!;
  const formGuid = process.env.HUBSPOT_FORM_GUID!;
  const custom = buildCustomProperties(lead, ctx);
  const fields = [
    ["firstname", lead.contact.firstName],
    ["lastname", lead.contact.lastName],
    ["email", lead.contact.email.toLowerCase()],
    ["phone", lead.contact.phone],
    ...Object.entries(custom),
  ]
    .filter(([, v]) => v !== "")
    .map(([name, value]) => ({ objectTypeId: "0-1", name, value }));

  const subscriptionTypeId = process.env.HUBSPOT_SUBSCRIPTION_TYPE_ID;
  const payload = {
    submittedAt: String(ctx.receivedAt.getTime()),
    fields,
    context: {
      pageUri: lead.tracking.pageUri,
      pageName: lead.tracking.pageName,
      ...(ctx.hutk ? { hutk: ctx.hutk } : {}),
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: "J'accepte d'être recontacté(e) par Voiland Finances & Patrimoine pour traiter ma demande.",
        communications:
          subscriptionTypeId && lead.consents.marketing
            ? [
                {
                  value: true,
                  subscriptionTypeId: Number(subscriptionTypeId),
                  text: "J'accepte de recevoir des informations de Voiland Finances & Patrimoine.",
                },
              ]
            : [],
      },
    },
  };

  const res = await fetch(`${FORMS_API}/${portalId}/${formGuid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.HUBSPOT_ACCESS_TOKEN
        ? { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HubSpot Forms: HTTP ${res.status} ${text.slice(0, 300)}`);
  }
}

export async function sendLeadToHubspot(
  lead: LeadRequest,
  ctx: LeadContext,
): Promise<HubspotMode> {
  const mode = getHubspotMode();
  if (mode === "crm") await sendViaCrm(lead, ctx);
  else if (mode === "forms") await sendViaForms(lead, ctx);
  else {
    // Mode démonstration : aucune donnée transmise, aucun identifiant personnel journalisé.
    console.info(
      `[leads:demo] ${ctx.reference} · ${lead.product} · ${lead.diagnostic.length} réponse(s) · source: ${describeSource(lead.tracking)}`,
    );
  }
  return mode;
}

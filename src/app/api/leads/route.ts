import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { sendLeadToHubspot } from "@/lib/hubspot";
import { leadRequestSchema, type LeadResponse } from "@/lib/lead-schema";
import { rateLimit } from "@/lib/rate-limit";

const MIN_FILL_MS = 2500;
const MAX_BODY = 32_000;

function reference() {
  return `VFP-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function json(body: LeadResponse, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  // 1. Même origine uniquement
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return json({ ok: false, error: "Origine non autorisée." }, 403);
      }
    } catch {
      return json({ ok: false, error: "Origine non autorisée." }, 403);
    }
  }

  // 2. Limitation de débit par IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rl = rateLimit(`lead:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Plusieurs demandes ont déjà été envoyées. Merci de réessayer dans quelques minutes ou de nous appeler.",
      } satisfies LeadResponse,
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  // 3. Lecture et validation
  const raw = await request.text();
  if (raw.length > MAX_BODY) {
    return json({ ok: false, error: "Demande trop volumineuse." }, 413);
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Format de demande invalide." }, 400);
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "Certaines informations sont incomplètes ou invalides.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
          string,
          string[]
        >,
      },
      422,
    );
  }
  const lead = parsed.data;
  const ref = reference();

  // 4. Anti-spam silencieux : pot de miel rempli ou formulaire rempli trop vite
  if ((lead.website && lead.website.length > 0) || lead.elapsedMs < MIN_FILL_MS) {
    return json({ ok: true, mode: "demo", reference: ref });
  }

  // 5. Transmission CRM
  try {
    const mode = await sendLeadToHubspot(lead, {
      reference: ref,
      receivedAt: new Date(),
      ipAddress: ip,
      hutk: request.cookies.get("hubspotutk")?.value,
    });
    return json({ ok: true, mode: mode === "demo" ? "demo" : "hubspot", reference: ref });
  } catch (err) {
    console.error("[leads] Échec de transmission", err instanceof Error ? err.message : err);
    return json(
      {
        ok: false,
        error:
          "Votre demande n'a pas pu être transmise pour le moment. Réessayez dans un instant ou contactez-nous directement.",
      },
      502,
    );
  }
}

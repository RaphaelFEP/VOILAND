import { z } from "zod";

/** Version du texte de consentement — tracée avec chaque demande. */
export const CONSENT_VERSION = "2026-11-v1";

export const leadProducts = [
  "mutuelle",
  "prevoyance",
  "emprunteur",
  "assurance-vie",
  "per",
  "contact",
] as const;
export type LeadProduct = (typeof leadProducts)[number];

export const leadProductLabels: Record<LeadProduct, string> = {
  mutuelle: "Mutuelle santé",
  prevoyance: "Prévoyance",
  emprunteur: "Assurance emprunteur",
  "assurance-vie": "Assurance-vie",
  per: "Plan d'Épargne Retraite (PER)",
  contact: "Demande de contact",
};

const PHONE_RE = /^(?:(?:\+|00)\d{2,3}[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export const callbackSlots = [
  "Indifférent",
  "Matin (9h-12h)",
  "Midi (12h-14h)",
  "Après-midi (14h-18h)",
] as const;

/** Champs de coordonnées utilisés côté client (React Hook Form). */
export const contactFieldsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { error: "Indiquez votre prénom." })
    .max(80, { error: "80 caractères maximum." }),
  lastName: z
    .string()
    .trim()
    .min(1, { error: "Indiquez votre nom." })
    .max(80, { error: "80 caractères maximum." }),
  email: z
    .string()
    .trim()
    .min(1, { error: "Indiquez votre adresse e-mail." })
    .max(160)
    .pipe(z.email({ error: "Cette adresse e-mail semble incomplète." })),
  phone: z
    .string()
    .trim()
    .min(1, { error: "Indiquez un numéro pour être rappelé(e)." })
    .regex(PHONE_RE, {
      error: "Numéro invalide. Exemple : 06 12 34 56 78",
    }),
  callbackSlot: z.enum(callbackSlots),
  consentContact: z.boolean().refine((v) => v === true, {
    error: "Votre accord est nécessaire pour que nous puissions vous répondre.",
  }),
  consentMarketing: z.boolean(),
  /** Pot de miel anti-spam : doit rester vide. */
  website: z.string().max(200).optional(),
});

export type ContactFields = z.infer<typeof contactFieldsSchema>;

export const contactDefaults: ContactFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  callbackSlot: "Indifférent",
  consentContact: false,
  consentMarketing: false,
  website: "",
};

export const contactFieldNames = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "callbackSlot",
  "consentContact",
  "consentMarketing",
] as const;

const shortText = (max = 300) => z.string().trim().max(max);

export const trackingSchema = z
  .object({
    utm_source: shortText(200).optional(),
    utm_medium: shortText(200).optional(),
    utm_campaign: shortText(200).optional(),
    utm_term: shortText(200).optional(),
    utm_content: shortText(200).optional(),
    gclid: shortText(300).optional(),
    referrer: shortText(500).optional(),
    landingPage: shortText(500).optional(),
    pageUri: shortText(500).optional(),
    pageName: shortText(200).optional(),
  })
  .partial();

export type Tracking = z.infer<typeof trackingSchema>;

/** Contrat de l'API POST /api/leads (validé côté serveur). */
export const leadRequestSchema = z.object({
  product: z.enum(leadProducts),
  objective: shortText(160).optional(),
  contact: contactFieldsSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    callbackSlot: true,
  }),
  message: shortText(2000).optional(),
  diagnostic: z
    .array(z.object({ label: shortText(120), value: shortText(600) }))
    .max(40)
    .default([]),
  consents: z.object({
    contact: z.literal(true, {
      error: "Le consentement au recontact est requis.",
    }),
    marketing: z.boolean(),
    version: shortText(40),
  }),
  tracking: trackingSchema.default({}),
  /** Champs anti-spam */
  website: z.string().max(200).optional(),
  elapsedMs: z.number().int().nonnegative().max(1000 * 60 * 60 * 24),
});

export type LeadRequest = z.infer<typeof leadRequestSchema>;

export type LeadResponse =
  | { ok: true; mode: "hubspot" | "demo"; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

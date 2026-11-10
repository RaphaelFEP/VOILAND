/**
 * Configuration éditoriale et réglementaire du cabinet.
 *
 * ⚠️ Toutes les valeurs `null` sont des informations À COMPLÉTER avant mise en
 * ligne. Elles s'affichent sur le site sous forme de marqueurs visibles
 * « [À compléter : …] » afin qu'aucune donnée ne soit inventée.
 */

export type MaybeText = string | null;

export const siteConfig = {
  name: "Voiland Finances & Patrimoine",
  shortName: "Voiland",
  tagline: "Protégez aujourd'hui. Construisez demain.",
  description:
    "Mutuelle, prévoyance, assurance emprunteur, assurance-vie et PER : des solutions personnalisées pour protéger vos revenus, optimiser vos contrats et préparer votre avenir.",
  /** URL publique du site (sans slash final) — variable NEXT_PUBLIC_SITE_URL */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  locale: "fr_FR",

  /** Date de dernière mise à jour des contenus (sitemap) — à tenir à jour. */
  contentUpdatedAt: "2026-11-09",

  company: {
    legalName: null as MaybeText, // Raison sociale
    legalForm: null as MaybeText, // Forme juridique (SAS, SARL, EI…)
    shareCapital: null as MaybeText, // Capital social
    siren: "108 527 235" as MaybeText,
    siret: "108 527 235 00015" as MaybeText,
    /** Activité déclarée (code NAF) */
    activity: "Activités des agents et courtiers d'assurances (NAF 66.22Z)" as MaybeText,
    rcs: null as MaybeText, // Ville d'immatriculation RCS
    vatNumber: null as MaybeText,
    address: null as MaybeText,
    publicationDirector: "Enzo Voiland" as MaybeText,
  },

  /** Conseiller référent */
  advisor: {
    name: "Enzo Voiland",
    role: "Conseiller en assurances et patrimoine",
  },

  contact: {
    email: "voiland.patrimoine@gmail.com" as MaybeText,
    phone: "06 03 22 09 95" as MaybeText,
    /** Format E.164 pour les liens tel: (ex. +33100000000) */
    phoneHref: "+33603220995" as MaybeText,
    openingHours: null as MaybeText,
    complaintsEmail: "voiland.patrimoine@gmail.com" as MaybeText,
    complaintsAddress: null as MaybeText,
  },

  regulatory: {
    /** Numéro d'immatriculation ORIAS — vérifiable sur orias.fr */
    orias: "26012950" as MaybeText,
    /** Ex. « Courtier en assurance (catégorie …) » — à confirmer */
    status: null as MaybeText,
    /** Autres statuts éventuels : CIF, IOBSP, etc. */
    otherStatuses: null as MaybeText,
    cifAssociation: null as MaybeText,
    professionalLiabilityInsurer: null as MaybeText,
    professionalLiabilityPolicy: null as MaybeText,
    financialGuarantee: null as MaybeText,
    /** Médiateur compétent (nom + coordonnées + site) */
    mediator: null as MaybeText,
    mediatorUrl: null as MaybeText,
    /** Nature de la rémunération (commission, honoraires, combinaison…) */
    remuneration: null as MaybeText,
    /** Liens capitalistiques > 10 % avec des compagnies, le cas échéant */
    capitalLinks: null as MaybeText,
    /** Liste des partenaires / obligation d'exclusivité, le cas échéant */
    partners: null as MaybeText,
  },

  hosting: {
    name: null as MaybeText,
    address: null as MaybeText,
    contact: null as MaybeText,
  },

  dpo: {
    contact: null as MaybeText,
  },
} as const;

/** URL de prise de rendez-vous HubSpot Meetings (publique, non secrète). */
export const meetingsUrl = process.env.NEXT_PUBLIC_HUBSPOT_MEETINGS_URL || null;

/** Portal ID HubSpot pour le code de suivi (chargé uniquement avec consentement). */
export const hubspotPortalId =
  process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || null;

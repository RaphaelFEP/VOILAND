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
    legalName: "Enzo Voiland EI" as MaybeText, // Raison sociale
    legalForm: "Entreprise individuelle (EI)" as MaybeText, // Forme juridique
    shareCapital: null as MaybeText, // Capital social
    siren: "108 527 235" as MaybeText,
    siret: "108 527 235 00015" as MaybeText,
    /** Activité déclarée (code NAF) */
    activity: "Activités des agents et courtiers d'assurances (NAF 66.22Z)" as MaybeText,
    rcs: "108 527 235" as MaybeText, // Numéro RCS
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
    openingHours: "Du lundi au vendredi, de 9 h à 20 h" as MaybeText,
    complaintsEmail: "voiland.patrimoine@gmail.com" as MaybeText,
    complaintsAddress: null as MaybeText,
  },

  regulatory: {
    /** Numéro d'immatriculation ORIAS — vérifiable sur orias.fr */
    orias: "26012950" as MaybeText,
    /** Date d'inscription ORIAS (catégorie MIA) — renouvellement annuel à surveiller */
    oriasSince: "06/11/2026" as MaybeText,
    /** Ex. « Courtier en assurance (catégorie …) » — à confirmer */
    status: "Mandataire d'intermédiaire d'assurance (MIA)" as MaybeText,
    /** Autres statuts éventuels : CIF, IOBSP, etc. */
    otherStatuses: null as MaybeText,
    cifAssociation: null as MaybeText,
    professionalLiabilityInsurer: "Lloyd's Insurance Company SA" as MaybeText,
    professionalLiabilityPolicy: "RB0002733" as MaybeText,
    /** Montants et territoire de la RC Pro */
    professionalLiabilityCoverage:
      "1 564 610 € par sinistre et 2 315 610 € par année d'assurance — Union européenne et Espace économique européen" as MaybeText,
    /** Intermédiaire mandant (obligatoire pour un MIA) : nom, statut, n° ORIAS */
    mandator: null as MaybeText,
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

/**
 * Lien de prise de rendez-vous (public, non secret) : Calendly par défaut,
 * remplaçable par NEXT_PUBLIC_BOOKING_URL (Calendly ou HubSpot Meetings).
 */
export const meetingsUrl: string | null =
  process.env.NEXT_PUBLIC_BOOKING_URL ||
  process.env.NEXT_PUBLIC_HUBSPOT_MEETINGS_URL ||
  "https://calendly.com/enzo-franceepargne/30min";

export const bookingProvider: "calendly" | "hubspot" | "autre" | null = !meetingsUrl
  ? null
  : /calendly\.com/.test(meetingsUrl)
    ? "calendly"
    : /hubspot/.test(meetingsUrl)
      ? "hubspot"
      : "autre";

export const bookingProviderName =
  bookingProvider === "calendly" ? "Calendly" : bookingProvider === "hubspot" ? "HubSpot Meetings" : "notre agenda en ligne";

/** Portal ID HubSpot pour le code de suivi (chargé uniquement avec consentement). */
export const hubspotPortalId =
  process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || null;

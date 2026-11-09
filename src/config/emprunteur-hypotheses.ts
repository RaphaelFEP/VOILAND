/**
 * Hypothèses de l'estimateur d'économies — assurance emprunteur.
 *
 * ⚠️ Grilles MOYENNES et INDICATIVES retenues par le cabinet pour donner un
 * ordre de grandeur. Elles ne sont ni des tarifs ni des offres. À calibrer
 * régulièrement avec les tarifs réels des assureurs partenaires.
 * Seul un devis d'assureur, à garanties équivalentes, confirme une économie.
 */

/** Taux annuel moyen d'un contrat groupe bancaire, en % du capital INITIAL, par âge à la souscription. */
export const bankGroupRates: { maxAge: number; rate: number }[] = [
  { maxAge: 29, rate: 0.3 },
  { maxAge: 34, rate: 0.32 },
  { maxAge: 39, rate: 0.36 },
  { maxAge: 44, rate: 0.4 },
  { maxAge: 49, rate: 0.46 },
  { maxAge: 54, rate: 0.55 },
  { maxAge: 59, rate: 0.66 },
  { maxAge: 200, rate: 0.8 },
];

/** Taux annuel moyen d'une assurance déléguée, en % du capital RESTANT DÛ, par âge atteint (non-fumeur). */
export const delegatedRates: { maxAge: number; rate: number }[] = [
  { maxAge: 24, rate: 0.08 },
  { maxAge: 29, rate: 0.09 },
  { maxAge: 34, rate: 0.11 },
  { maxAge: 39, rate: 0.14 },
  { maxAge: 44, rate: 0.19 },
  { maxAge: 49, rate: 0.27 },
  { maxAge: 54, rate: 0.39 },
  { maxAge: 59, rate: 0.55 },
  { maxAge: 64, rate: 0.75 },
  { maxAge: 69, rate: 1.0 },
  { maxAge: 200, rate: 1.3 },
];

/** Majoration fumeur appliquée aux grilles. */
export const smokerFactor = { bank: 1.15, delegated: 1.7 };

/** Fourchette : sensibilité appliquée au tarif délégué estimé (prudent / favorable). */
export const rangeFactors = { prudent: 1.25, favorable: 0.85 };
/** Incertitude sur la cotisation actuelle lorsqu'elle n'est pas renseignée. */
export const currentUncertainty = 0.12;

/** Taux moyen de crédit immobilier par année de signature (%), utilisé si le taux n'est pas renseigné. */
export const averageLoanRates: Record<number, number> = {
  2010: 3.6, 2011: 3.9, 2012: 3.4, 2013: 3.0, 2014: 2.6, 2015: 2.1, 2016: 1.6,
  2017: 1.5, 2018: 1.45, 2019: 1.25, 2020: 1.25, 2021: 1.1, 2022: 1.6,
  2023: 3.6, 2024: 3.6, 2025: 3.2, 2026: 3.2,
};
export const defaultLoanRate = 3.0;

/** En dessous de ce montant, on parle de contrat déjà compétitif plutôt que d'économie. */
export const minMeaningfulSaving = 300;

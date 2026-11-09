export type PrevoyanceInput = {
  monthlyIncome: number; // revenu net mensuel
  proCharges: number; // charges fixes professionnelles mensuelles
  personalCharges: number; // charges fixes personnelles mensuelles
  /** Indemnités journalières totales connues (régime obligatoire + contrats), €/jour */
  dailyAllowance: number;
  /** Franchise (jours non indemnisés) si connue */
  franchiseDays: number;
  /** Part du revenu à maintenir (décimal) */
  targetShare: number;
  /** Épargne de précaution mobilisable */
  savings: number;
};

export type PrevoyanceResult = {
  monthlyNeed: number;
  monthlyCoverage: number;
  monthlyGap: number;
  coverageRatio: number; // 0..1+
  franchiseCost: number;
  /** Nombre de mois pendant lesquels l'épargne compense l'écart (Infinity si aucun écart) */
  autonomyMonths: number;
};

/** Estimation pédagogique : ne remplace pas l'étude des conditions générales. */
export function computePrevoyance(input: PrevoyanceInput): PrevoyanceResult {
  const charges = input.proCharges + input.personalCharges;
  const incomeTarget = input.monthlyIncome * input.targetShare;
  const monthlyNeed = Math.max(charges, incomeTarget);
  const monthlyCoverage = Math.max(0, input.dailyAllowance) * 30;
  const monthlyGap = Math.max(0, monthlyNeed - monthlyCoverage);
  const coverageRatio = monthlyNeed > 0 ? monthlyCoverage / monthlyNeed : 1;
  const franchiseCost = (monthlyNeed / 30) * Math.max(0, input.franchiseDays);
  const available = Math.max(0, input.savings - franchiseCost);
  const autonomyMonths =
    monthlyGap > 0 ? available / monthlyGap : Number.POSITIVE_INFINITY;
  return {
    monthlyNeed,
    monthlyCoverage,
    monthlyGap,
    coverageRatio,
    franchiseCost,
    autonomyMonths,
  };
}

import {
  averageLoanRates,
  bankGroupRates,
  currentUncertainty,
  defaultLoanRate,
  delegatedRates,
  rangeFactors,
  smokerFactor,
} from "@/config/emprunteur-hypotheses";

export type SavingsInput = {
  loanAmount: number; // montant initial (€)
  startYear: number;
  startMonth: number; // 1-12
  durationYears: number; // durée initiale
  age: number; // âge actuel
  smoker: boolean;
  /** Quotité totale assurée (1 = 100 %, 2 = 200 %) */
  coverage: number;
  /** Cotisation mensuelle actuelle totale, si connue */
  currentMonthly?: number;
  /** Taux nominal du crédit (%), si connu */
  loanRate?: number;
  /** Date de référence (aujourd'hui) */
  now: { year: number; month: number };
};

export type SavingsResult = {
  elapsedMonths: number;
  remainingMonths: number;
  loanRateUsed: number;
  loanRateAssumed: boolean;
  currentMonthlyUsed: number;
  currentAssumed: boolean;
  currentCost: number;
  newCost: number;
  saving: number;
  savingLow: number;
  savingHigh: number;
  savingRate: number; // part du coût actuel
  monthlyGain: number;
  precision: 1 | 2 | 3;
  yearly: { year: number; label: string; current: number; next: number }[];
};

const pick = (grid: { maxAge: number; rate: number }[], age: number) =>
  (grid.find((g) => age <= g.maxAge) ?? grid[grid.length - 1]).rate / 100;

/**
 * Estimation pédagogique de l'économie possible en changeant d'assurance
 * emprunteur (assurance déléguée calculée sur le capital restant dû).
 * Résultat indicatif, non contractuel.
 */
export function estimateSavings(i: SavingsInput): SavingsResult {
  const n = Math.max(1, Math.round(i.durationYears * 12));
  const elapsed = Math.max(
    0,
    (i.now.year - i.startYear) * 12 + (i.now.month - i.startMonth),
  );
  const elapsedMonths = Math.min(n, elapsed);
  const remainingMonths = Math.max(0, n - elapsedMonths);

  const loanRateAssumed = !(i.loanRate && i.loanRate > 0);
  const loanRateUsed = loanRateAssumed
    ? (averageLoanRates[i.startYear] ?? defaultLoanRate)
    : i.loanRate!;
  const r = loanRateUsed / 100 / 12;
  const payment = r > 0 ? (i.loanAmount * r) / (1 - Math.pow(1 + r, -n)) : i.loanAmount / n;
  const crd = (k: number) =>
    r > 0
      ? Math.max(0, i.loanAmount * Math.pow(1 + r, k) - (payment * (Math.pow(1 + r, k) - 1)) / r)
      : Math.max(0, i.loanAmount - payment * k);

  // Cotisation actuelle : déclarée, sinon contrat groupe bancaire moyen sur capital initial.
  const ageAtStart = Math.max(18, i.age - elapsedMonths / 12);
  const currentAssumed = !(i.currentMonthly && i.currentMonthly > 0);
  const currentMonthlyUsed = currentAssumed
    ? (i.loanAmount * pick(bankGroupRates, ageAtStart) * (i.smoker ? smokerFactor.bank : 1) * i.coverage) / 12
    : i.currentMonthly!;

  const yearly: SavingsResult["yearly"] = [];
  let currentCost = 0;
  let newCost = 0;
  for (let m = 0; m < remainingMonths; m++) {
    const k = elapsedMonths + m;
    const ageNow = i.age + m / 12;
    const rate = pick(delegatedRates, ageNow) * (i.smoker ? smokerFactor.delegated : 1);
    currentCost += currentMonthlyUsed;
    newCost += (crd(k) * rate * i.coverage) / 12;
    if ((m + 1) % 12 === 0 || m === remainingMonths - 1) {
      const y = Math.ceil((m + 1) / 12);
      yearly.push({ year: y, label: `An ${y}`, current: currentCost, next: newCost });
    }
  }

  const saving = Math.max(0, currentCost - newCost);
  const curLow = currentAssumed ? currentCost * (1 - currentUncertainty) : currentCost;
  const curHigh = currentAssumed ? currentCost * (1 + currentUncertainty) : currentCost;
  const savingLow = Math.max(0, curLow - newCost * rangeFactors.prudent);
  const savingHigh = Math.max(0, curHigh - newCost * rangeFactors.favorable);

  const precision: 1 | 2 | 3 = currentAssumed ? 1 : loanRateAssumed ? 2 : 3;

  return {
    elapsedMonths,
    remainingMonths,
    loanRateUsed,
    loanRateAssumed,
    currentMonthlyUsed,
    currentAssumed,
    currentCost,
    newCost,
    saving,
    savingLow,
    savingHigh,
    savingRate: currentCost > 0 ? saving / currentCost : 0,
    monthlyGain: remainingMonths > 0 ? saving / remainingMonths : 0,
    precision,
    yearly,
  };
}

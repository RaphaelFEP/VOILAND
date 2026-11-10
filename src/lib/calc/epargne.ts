export type EpargneInput = {
  initial: number; // capital initial (€)
  monthly: number; // épargne mensuelle (€)
  years: number; // horizon (années)
  rate: number; // taux de rendement annuel (décimal), hypothèse constante
};

export type EpargnePoint = {
  year: number;
  contributions: number; // versements cumulés
  interest: number; // intérêts cumulés
  total: number; // capital
};

export type EpargneResult = {
  series: EpargnePoint[];
  final: EpargnePoint;
};

/**
 * Intérêts composés, capitalisation mensuelle (taux annuel équivalent),
 * versements en fin de mois. Projection illustrative à taux constant.
 */
export function projectEpargne(i: EpargneInput): EpargneResult {
  const months = Math.max(1, Math.round(i.years * 12));
  const rM = Math.pow(1 + i.rate, 1 / 12) - 1;
  let total = i.initial;
  let contributions = i.initial;
  const series: EpargnePoint[] = [{ year: 0, contributions, interest: 0, total }];
  for (let m = 1; m <= months; m++) {
    total = total * (1 + rM) + i.monthly;
    contributions += i.monthly;
    if (m % 12 === 0 || m === months) {
      series.push({
        year: Math.round((m / 12) * 10) / 10,
        contributions,
        interest: total - contributions,
        total,
      });
    }
  }
  return { series, final: series[series.length - 1] };
}

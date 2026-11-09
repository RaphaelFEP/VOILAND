export type EpargneInput = {
  initial: number; // capital initial (€)
  monthly: number; // versement mensuel (€)
  years: number; // horizon (années)
  grossRate: number; // hypothèse de rendement annuel brut (décimal)
  annualFees: number; // frais annuels de gestion (décimal)
  entryFees: number; // frais sur versements (décimal)
  inflation: number; // inflation annuelle (décimal)
};

export type EpargnePoint = {
  year: number;
  contributions: number;
  gross: number; // sans aucun frais
  net: number; // après frais (avant fiscalité et prélèvements sociaux)
  real: number; // net exprimé en euros constants (pouvoir d'achat)
};

export type EpargneResult = {
  series: EpargnePoint[];
  final: EpargnePoint;
  totalFeesImpact: number; // brut − net
  netGains: number; // net − versements
};

/** Projection mensuelle à taux constant — strictement illustrative. */
export function projectEpargne(input: EpargneInput): EpargneResult {
  const months = Math.max(1, Math.round(input.years * 12));
  const rM = Math.pow(1 + input.grossRate, 1 / 12) - 1;
  const feeM = 1 - Math.pow(1 - Math.min(0.99, input.annualFees), 1 / 12);
  const entry = 1 - Math.min(0.99, Math.max(0, input.entryFees));

  let gross = input.initial;
  let net = input.initial * entry;
  let contributions = input.initial;
  const series: EpargnePoint[] = [
    { year: 0, contributions, gross, net, real: net },
  ];

  for (let m = 1; m <= months; m++) {
    gross = gross * (1 + rM) + input.monthly;
    net = net * (1 + rM) * (1 - feeM) + input.monthly * entry;
    contributions += input.monthly;
    if (m % 12 === 0 || m === months) {
      const year = m / 12;
      const real = net / Math.pow(1 + input.inflation, year);
      series.push({
        year: Math.round(year * 10) / 10,
        contributions,
        gross,
        net,
        real,
      });
    }
  }

  const final = series[series.length - 1];
  return {
    series,
    final,
    totalFeesImpact: final.gross - final.net,
    netGains: final.net - final.contributions,
  };
}

/** Trois scénarios autour de l'hypothèse saisie (±2 points), à titre illustratif. */
export function scenarioRates(base: number) {
  return {
    low: Math.max(-0.05, base - 0.02),
    mid: base,
    high: base + 0.02,
  };
}

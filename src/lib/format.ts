const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const eurCents = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const num = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatEur = (n: number) => eur.format(Number.isFinite(n) ? n : 0);
export const formatEurCents = (n: number) =>
  eurCents.format(Number.isFinite(n) ? n : 0);
export const formatNumber = (n: number) =>
  num.format(Number.isFinite(n) ? n : 0);
/** `rate` exprimé en décimal (0.03 → « 3 % ») */
export const formatPct = (rate: number) =>
  pct.format(Number.isFinite(rate) ? rate : 0);

export const formatCompactEur = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000)
    return `${(n / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M€`;
  if (abs >= 1_000)
    return `${(n / 1_000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} k€`;
  return `${Math.round(n)} €`;
};

export function formatDuration(months: number) {
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  const parts = [];
  if (y) parts.push(`${y} an${y > 1 ? "s" : ""}`);
  if (m) parts.push(`${m} mois`);
  return parts.join(" et ") || "0 mois";
}

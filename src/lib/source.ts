import type { Tracking } from "./lead-schema";

/** Source de trafic lisible (pour le CRM). */
export function describeSource(t: Tracking): string {
  if (t.gclid) return "Google Ads";
  if (t.utm_source)
    return [t.utm_source, t.utm_medium].filter(Boolean).join(" / ");
  if (t.referrer) {
    try {
      const host = new URL(t.referrer).hostname.replace(/^www\./, "");
      if (/google|bing|qwant|duckduckgo|ecosia|yahoo/.test(host))
        return `Recherche naturelle (${host})`;
      if (/linkedin|facebook|instagram|x\.com|twitter/.test(host))
        return `Réseaux sociaux (${host})`;
      return `Site référent (${host})`;
    } catch {
      return "Site référent";
    }
  }
  return "Accès direct";
}

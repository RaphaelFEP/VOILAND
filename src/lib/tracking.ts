import type { Tracking } from "./lead-schema";

const KEY = "voiland-attribution";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
] as const;

/**
 * Mémorise la source de la première visite de la session (UTM, référent,
 * page d'arrivée) dans sessionStorage. Ces données restent dans le navigateur
 * et ne sont transmises que si le visiteur envoie volontairement un formulaire.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Tracking = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) data[k] = v.slice(0, 200);
    }
    const ref = document.referrer;
    if (ref && !ref.startsWith(window.location.origin)) {
      data.referrer = ref.slice(0, 500);
    }
    data.landingPage = (window.location.pathname + window.location.search).slice(
      0,
      500,
    );
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* stockage indisponible : on continue sans attribution */
  }
}

export function readAttribution(): Tracking {
  const base: Tracking = {};
  if (typeof window === "undefined") return base;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) Object.assign(base, JSON.parse(raw) as Tracking);
  } catch {
    /* ignore */
  }
  base.pageUri = window.location.href.slice(0, 500);
  base.pageName = document.title.slice(0, 200);
  return base;
}

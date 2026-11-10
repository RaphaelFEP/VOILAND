"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { bookingProviderName, hubspotPortalId, meetingsUrl } from "@/config/site";

export type ConsentCategory = "thirdParty" | "marketing";

export type ConsentState = {
  version: number;
  decidedAt: string;
  thirdParty: boolean;
  marketing: boolean;
};

type CategoryInfo = {
  id: ConsentCategory;
  title: string;
  description: string;
};

const STORAGE_KEY = "voiland-consent";
const CONSENT_VERSION = 1;
/** Conservation du choix : 6 mois (recommandation CNIL), puis nouvelle demande. */
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182;
const DEMO = process.env.NEXT_PUBLIC_CONSENT_DEMO === "1";

/** Catégories effectivement utilisées selon la configuration. */
export const consentCategories: CategoryInfo[] = [
  ...(meetingsUrl || DEMO
    ? [
        {
          id: "thirdParty" as const,
          title: "Services tiers — prise de rendez-vous",
          description:
            `Affichage de l'agenda ${bookingProviderName} intégré au site. Ce service peut déposer ses propres traceurs.`,
        },
      ]
    : []),
  ...(hubspotPortalId || DEMO
    ? [
        {
          id: "marketing" as const,
          title: "Suivi de la relation commerciale (HubSpot)",
          description:
            "Mesure des pages consultées et rattachement de votre visite à votre demande, afin d'améliorer notre accompagnement.",
        },
      ]
    : []),
];

type Ctx = {
  consent: ConsentState | null;
  ready: boolean;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  save: (choices: Partial<Record<ConsentCategory, boolean>>) => void;
  has: (c: ConsentCategory) => boolean;
};

const ConsentContext = createContext<Ctx | null>(null);

function read(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (Date.now() - new Date(parsed.decidedAt).getTime() > MAX_AGE_MS)
      return null;
    return parsed;
  } catch {
    return null;
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    // Lecture après hydratation (le choix est stocké dans le navigateur).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(read());
    setReady(true);
  }, []);

  const save = useCallback(
    (choices: Partial<Record<ConsentCategory, boolean>>) => {
      const next: ConsentState = {
        version: CONSENT_VERSION,
        decidedAt: new Date().toISOString(),
        thirdParty: !!choices.thirdParty,
        marketing: !!choices.marketing,
      };
      const withdrew = consent?.marketing && !next.marketing;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      setConsent(next);
      setPreferencesOpen(false);
      // Retrait du consentement : on recharge pour décharger le script de suivi.
      if (withdrew) window.location.reload();
    },
    [consent],
  );

  const value = useMemo<Ctx>(
    () => ({
      consent,
      ready,
      preferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      save,
      has: (c) => !!consent?.[c],
    }),
    [consent, ready, preferencesOpen, save],
  );

  const region = process.env.NEXT_PUBLIC_HUBSPOT_REGION;
  const trackingSrc = hubspotPortalId
    ? `https://js${region ? `-${region}` : ""}.hs-scripts.com/${hubspotPortalId}.js`
    : null;

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {trackingSrc && consent?.marketing ? (
        <Script id="hs-script-loader" src={trackingSrc} strategy="lazyOnload" />
      ) : null}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent doit être utilisé dans <ConsentProvider>");
  return ctx;
}

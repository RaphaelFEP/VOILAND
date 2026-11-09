"use client";

import { CalendarDays, ShieldCheck } from "lucide-react";

import { useConsent } from "@/components/consent/consent-provider";
import { meetingsUrl } from "@/config/site";

/**
 * Calendrier HubSpot Meetings. Chargé uniquement après action de
 * l'utilisateur ou consentement « services tiers » (le service tiers peut
 * déposer ses propres traceurs).
 */
export function BookingEmbed() {
  const { has, save, consent } = useConsent();

  if (!meetingsUrl) {
    return (
      <div className="glass glass-strong rounded-[32px] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-peach-2 text-coral-ink">
          <CalendarDays className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-ink">Agenda en ligne — mode démonstration</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Le module de prise de rendez-vous HubSpot n&apos;est pas encore configuré. Renseignez la
          variable <code className="rounded bg-white px-1.5 py-0.5 text-ink">NEXT_PUBLIC_HUBSPOT_MEETINGS_URL</code>{" "}
          pour afficher l&apos;agenda ici. En attendant, laissez-nous vos coordonnées : nous vous
          rappelons pour fixer un créneau.
        </p>
        <a href="/contact" className="btn btn-primary mt-6">
          <span className="relative z-10">Être rappelé(e)</span>
        </a>
      </div>
    );
  }

  if (!has("thirdParty")) {
    return (
      <div className="glass glass-strong rounded-[32px] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-peach-2 text-coral-ink">
          <ShieldCheck className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-ink">Afficher l&apos;agenda de rendez-vous</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          L&apos;agenda est fourni par HubSpot, service tiers susceptible de déposer des traceurs.
          Il ne se charge qu&apos;avec votre accord.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => save({ thirdParty: true, marketing: !!consent?.marketing })}
          >
            <span className="relative z-10">Afficher l&apos;agenda</span>
          </button>
          <a href={meetingsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
            Ouvrir dans un nouvel onglet
          </a>
        </div>
      </div>
    );
  }

  const src = `${meetingsUrl}${meetingsUrl.includes("?") ? "&" : "?"}embed=true`;
  return (
    <div className="glass glass-strong overflow-hidden rounded-[32px] p-2">
      <iframe
        title="Agenda de prise de rendez-vous"
        src={src}
        className="h-[720px] w-full rounded-[26px] bg-white"
        loading="lazy"
      />
    </div>
  );
}

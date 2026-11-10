"use client";

import { CalendarDays, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { useConsent } from "@/components/consent/consent-provider";
import { bookingProvider, bookingProviderName, meetingsUrl } from "@/config/site";

/** Désactivable (ex. prévisualisation sans iframe tierce autorisée). */
const EMBED_ALLOWED = process.env.NEXT_PUBLIC_DISABLE_EMBED !== "1";

function embedSrc(url: string) {
  const u = new URL(url);
  if (bookingProvider === "calendly") {
    u.searchParams.set("embed_type", "Inline");
    u.searchParams.set("embed_domain", window.location.host);
    u.searchParams.set("hide_gdpr_banner", "1");
    u.searchParams.set("primary_color", "0b1a33");
  } else {
    u.searchParams.set("embed", "true");
  }
  return u.toString();
}

/**
 * Agenda de prise de rendez-vous (Calendly ou HubSpot Meetings).
 * Chargé uniquement après consentement « services tiers » : le service tiers
 * peut déposer ses propres traceurs.
 */
export function BookingEmbed() {
  const { has, save, consent } = useConsent();

  if (!meetingsUrl) {
    return (
      <div className="glass glass-strong rounded-[32px] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-peach-2 text-coral-ink">
          <CalendarDays className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-ink">Agenda en ligne indisponible</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Laissez-moi vos coordonnées : je vous rappelle sous 24 h pour fixer un créneau.
        </p>
        <Link href="/contact" className="btn btn-primary mt-6">
          <span className="relative z-10">Être rappelé(e)</span>
        </Link>
      </div>
    );
  }

  const external = (
    <a href={meetingsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
      Ouvrir l&apos;agenda <ExternalLink className="h-4 w-4" aria-hidden />
    </a>
  );

  if (!EMBED_ALLOWED || !has("thirdParty")) {
    return (
      <div className="glass glass-strong rounded-[32px] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-peach-2 text-coral-ink">
          {EMBED_ALLOWED ? <ShieldCheck className="h-6 w-6" aria-hidden /> : <CalendarDays className="h-6 w-6" aria-hidden />}
        </span>
        <h2 className="mt-5 text-xl font-semibold text-ink">Choisissez votre créneau</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          {EMBED_ALLOWED
            ? `L'agenda est fourni par ${bookingProviderName}, service tiers susceptible de déposer des traceurs. Il ne s'affiche ici qu'avec votre accord.`
            : `Réservez un échange de 30 minutes directement dans l'agenda ${bookingProviderName}.`}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {EMBED_ALLOWED ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => save({ thirdParty: true, marketing: !!consent?.marketing })}
            >
              <span className="relative z-10">Afficher l&apos;agenda ici</span>
            </button>
          ) : null}
          {external}
        </div>
      </div>
    );
  }

  return (
    <div className="glass glass-strong overflow-hidden rounded-[32px] p-2">
      <iframe
        title={`Agenda de prise de rendez-vous ${bookingProviderName}`}
        src={embedSrc(meetingsUrl)}
        className="h-[760px] w-full rounded-[26px] bg-white"
        loading="lazy"
      />
      <p className="px-4 py-3 text-center text-xs text-muted">
        L&apos;agenda ne s&apos;affiche pas ?{" "}
        <a href={meetingsUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-2">
          Ouvrez-le dans un nouvel onglet
        </a>
        .
      </p>
    </div>
  );
}

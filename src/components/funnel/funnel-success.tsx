"use client";

import { CalendarDays, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import * as m from "motion/react-m";
import type { Ref } from "react";

import { meetingsUrl } from "@/config/site";
import type { LeadResponse } from "@/lib/lead-schema";

export function buildMeetingsUrl(p: { firstName?: string; lastName?: string; email?: string }) {
  if (!meetingsUrl) return null;
  try {
    const u = new URL(meetingsUrl);
    if (p.firstName) u.searchParams.set("firstName", p.firstName);
    if (p.lastName) u.searchParams.set("lastName", p.lastName);
    if (p.email) u.searchParams.set("email", p.email);
    return u.toString();
  } catch {
    return meetingsUrl;
  }
}

export function FunnelSuccess({
  ref,
  result,
  firstName,
  lastName,
  email,
}: {
  ref?: Ref<HTMLHeadingElement>;
  result: Extract<LeadResponse, { ok: true }>;
  firstName?: string;
  lastName?: string;
  email?: string;
}) {
  const booking = buildMeetingsUrl({ firstName, lastName, email });
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-2 text-center"
      role="status"
    >
      <m.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-peach to-rose-2 text-coral-ink shadow-[0_12px_30px_-12px_rgb(255_139_116/0.8)]"
      >
        <CheckCircle2 className="h-8 w-8" aria-hidden />
      </m.span>
      <h3 ref={ref} tabIndex={-1} className="mt-6 text-2xl font-semibold tracking-tight text-ink outline-none">
        Merci{firstName ? ` ${firstName}` : ""}, votre demande a bien été reçue.
      </h3>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Un conseiller vous recontacte au créneau indiqué pour approfondir votre
        situation. Vous pouvez aussi réserver dès maintenant un rendez-vous.
      </p>
      <p className="mt-3 text-xs text-subtle">Référence : {result.reference}</p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {booking ? (
          <a href={booking} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <CalendarDays className="relative z-10 h-4 w-4" aria-hidden />
            <span className="relative z-10">Choisir un créneau</span>
          </a>
        ) : (
          <Link href="/rendez-vous" className="btn btn-primary">
            <CalendarDays className="relative z-10 h-4 w-4" aria-hidden />
            <span className="relative z-10">Réserver un rendez-vous</span>
          </Link>
        )}
        <Link href="/" className="btn btn-glass">
          Retour à l&apos;accueil
        </Link>
      </div>

      {result.mode === "demo" ? (
        <p className="mx-auto mt-8 flex max-w-md items-start gap-2 rounded-2xl bg-peach-2/70 p-4 text-left text-xs leading-relaxed text-coral-ink ring-1 ring-coral/25">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            <strong>Mode démonstration</strong> : l&apos;intégration HubSpot
            n&apos;est pas encore configurée, aucune donnée n&apos;a été
            transmise à un CRM. Voir docs/HUBSPOT.md pour l&apos;activer.
          </span>
        </p>
      ) : null}
    </m.div>
  );
}

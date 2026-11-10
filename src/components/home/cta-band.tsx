import { ArrowRight, CalendarDays } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export function CtaBand({
  title = "Faisons le point sur vos protections et votre épargne.",
  text = "Un échange pour comprendre votre situation, des recommandations écrites et argumentées, un suivi dans la durée.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <Section labelledBy="cta-title" className="py-16 sm:py-20">
      <div className="glass-ink relative overflow-hidden rounded-[36px] px-7 py-14 text-center sm:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-coral/25 blur-3xl"
        />
        <h2
          id="cta-title"
          className="relative mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
        >
          {title}
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/75">{text}</p>
        <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/rendez-vous" variant="light" icon={<CalendarDays className="h-4 w-4" />}>
            Prendre rendez-vous
          </ButtonLink>
          <ButtonLink
            href="/contact"
            className="!bg-white/10 !shadow-none ring-1 ring-white/25 hover:!bg-white/15"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            M&apos;écrire
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

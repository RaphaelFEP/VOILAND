import { ArrowRight, CalendarDays, Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-40"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-4">
          <div className="hero-in relative z-10">
            <p className="eyebrow">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-coral to-rose" />
              Assurances · Épargne · Retraite
            </p>
            <h1
              id="hero-title"
              className="mt-5 text-[2.55rem] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[3.1rem] xl:text-[3.55rem]"
            >
              <span className="lg:whitespace-nowrap">Protégez aujourd&apos;hui.</span>
              <br />
              <span className="text-gradient lg:whitespace-nowrap">Construisez demain.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Mutuelle, prévoyance, assurance emprunteur et épargne : des
              solutions personnalisées pour protéger vos revenus, optimiser vos
              contrats et préparer votre avenir.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="/#objectif"
                icon={<ArrowRight className="h-4 w-4" />}
                className="min-h-[3.25rem] px-6 text-base"
              >
                Réaliser mon diagnostic
              </ButtonLink>
              <ButtonLink
                href="/rendez-vous"
                variant="glass"
                icon={<CalendarDays className="h-4 w-4" />}
                className="min-h-[3.25rem] px-6 text-base"
              >
                Prendre rendez-vous
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {["Analyse personnalisée", "Sans engagement", "Accompagnement dans la durée"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/80 ring-1 ring-line">
                      <Check className="h-3 w-3 text-coral-ink" aria-hidden />
                    </span>
                    {t}
                  </li>
                ),
              )}
            </ul>
          </div>

          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}

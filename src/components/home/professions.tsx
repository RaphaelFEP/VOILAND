import { Briefcase, Building2, Stethoscope, UserRound, Users } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

const professions = [
  {
    icon: Stethoscope,
    title: "Professions libérales",
    text: "Kinésithérapeutes, médecins, avocats… Des régimes obligatoires spécifiques à compléter avec précision.",
  },
  {
    icon: Building2,
    title: "Dirigeants",
    text: "Protection du dirigeant, de sa famille et de son entreprise, épargne et retraite.",
  },
  {
    icon: Briefcase,
    title: "Indépendants",
    text: "Maintien des revenus, frais professionnels et préparation de la retraite.",
  },
  {
    icon: UserRound,
    title: "Salariés",
    text: "Compléter les garanties collectives et optimiser l'épargne de long terme.",
  },
  {
    icon: Users,
    title: "Particuliers",
    text: "Santé de la famille, assurance de prêt immobilier et projets patrimoniaux.",
  },
];

export function Professions() {
  return (
    <Section id="professions" labelledBy="professions-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-start">
        <SectionHeading
          id="professions-title"
          eyebrow="Professions accompagnées"
          title="Chaque métier a ses propres risques."
          description="Les régimes obligatoires, les revenus et les besoins diffèrent fortement d'une profession à l'autre. J'en tiens compte dès le premier échange."
          className="lg:sticky lg:top-32"
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {professions.map(({ icon: Icon, title, text }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 0.06}
              className={i === 0 ? "sm:col-span-2" : undefined}
            >
              <div data-spotlight="" className="glass flex h-full gap-4 rounded-[26px] p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-ink ring-1 ring-line">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

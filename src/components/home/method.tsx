import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

const steps = [
  {
    title: "Analyse de votre situation",
    text: "Un échange pour comprendre votre activité, vos revenus, vos proches et vos contrats en cours.",
  },
  {
    title: "Comparaison des solutions adaptées",
    text: "J'étudie les garanties, les exclusions, les frais et les conditions des solutions pertinentes.",
  },
  {
    title: "Présentation des recommandations",
    text: "Une restitution claire, argumentée et écrite, pour décider en connaissance de cause.",
  },
  {
    title: "Accompagnement dans le temps",
    text: "Mise en place, suivi et révisions régulières à chaque évolution de votre situation.",
  },
];

export function Method() {
  return (
    <Section id="methode" labelledBy="methode-title">
      <SectionHeading
        id="methode-title"
        eyebrow="Notre méthode"
        title="Quatre étapes, une seule boussole : vos intérêts."
        align="center"
      />
      <div className="relative mt-16">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[54px] hidden h-px bg-gradient-to-r from-transparent via-coral/50 to-transparent lg:block"
        />
      <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.1}>
            <div className="glass relative h-full rounded-[28px] p-7" data-spotlight="">
              <span className="relative grid h-[52px] w-[52px] place-items-center rounded-2xl bg-white text-lg font-semibold text-ink shadow-[0_10px_30px_-12px_rgb(11_26_51/0.35)] ring-1 ring-line">
                <span className="text-gradient">0{i + 1}</span>
              </span>
              <h3 className="mt-6 text-lg font-semibold leading-snug text-ink">{s.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
      </div>
    </Section>
  );
}

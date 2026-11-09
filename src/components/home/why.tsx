import { Compass, Handshake, ScanSearch } from "lucide-react";

import { Mascot } from "@/components/mascot/mascot";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

const pillars = [
  {
    icon: Compass,
    title: "Une approche personnalisée",
    text: "Votre métier, votre famille, vos projets : chaque recommandation part de votre situation réelle, jamais d'un produit standard.",
  },
  {
    icon: ScanSearch,
    title: "Une analyse de vos besoins",
    text: "Nous lisons vos contrats existants, identifions les doublons, les manques et les frais, puis comparons des solutions adaptées.",
  },
  {
    icon: Handshake,
    title: "Un accompagnement dans la durée",
    text: "Votre situation évolue : nous revoyons vos garanties et votre épargne aux moments clés de votre vie personnelle et professionnelle.",
  },
];

export function Why() {
  return (
    <Section id="pourquoi" labelledBy="pourquoi-title">
      <div className="glass-ink overflow-hidden rounded-[36px] p-7 sm:p-12 lg:p-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow !text-peach">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-peach" />
              Pourquoi nous choisir
            </p>
            <h2
              id="pourquoi-title"
              className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-[2.6rem]"
            >
              Pourquoi Voiland Finances &amp; Patrimoine ?
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Une approche personnalisée, une analyse de vos besoins et un
              accompagnement dans la durée. Notre rôle : rendre vos protections
              lisibles et vos décisions sereines.
            </p>
            <ul className="mt-10 grid gap-4">
              {pillars.map(({ icon: Icon, title, text }, i) => (
                <Reveal as="li" key={title} delay={i * 0.08}>
                  <div className="flex gap-4 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-coral to-rose text-white shadow-[0_10px_24px_-10px_rgb(255_139_116/0.8)]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">{text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-[340px]">
            <div
              aria-hidden
              className="absolute inset-[10%] rounded-full bg-gradient-to-br from-coral/40 to-rose/30 blur-3xl"
            />
            <Mascot className="relative h-auto w-full" wave={false} />
          </div>
        </div>
      </div>
    </Section>
  );
}

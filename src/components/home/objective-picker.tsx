import { ArrowRight, HeartPulse, Home, ShieldCheck, Sprout } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { products } from "@/config/products";

const objectives = [
  {
    product: products.mutuelle,
    icon: HeartPulse,
    label: "Mieux être remboursé ou payer le juste prix",
    detail: "Diagnostic mutuelle · 2 min",
  },
  {
    product: products.prevoyance,
    icon: ShieldCheck,
    label: "Protéger mes revenus en cas d'arrêt de travail",
    detail: "Évaluation prévoyance · 3 min",
  },
  {
    product: products.emprunteur,
    icon: Home,
    label: "Réduire le coût de mon assurance de prêt",
    detail: "Simulateur emprunteur · 1 min",
  },
  {
    product: products.epargne,
    icon: Sprout,
    label: "Faire fructifier mon épargne et préparer ma retraite",
    detail: "Projection épargne · 2 min",
  },
];

export function ObjectivePicker() {
  return (
    <Section id="objectif" labelledBy="objectif-title" className="pt-8 sm:pt-12">
      <SectionHeading
        id="objectif-title"
        eyebrow="Votre diagnostic"
        title="Par quoi souhaitez-vous commencer ?"
        description="Choisissez votre objectif : quelques questions simples suffisent pour obtenir une première information utile, puis, si vous le souhaitez, une analyse personnalisée."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {objectives.map(({ product, icon: Icon, label, detail }, i) => (
          <Reveal as="li" key={product.id} delay={i * 0.06}>
            <Link
              href={`${product.href}#diagnostic`}
              data-spotlight=""
              className="glass group flex h-full items-center gap-5 rounded-[26px] p-5 transition-transform duration-500 hover:-translate-y-1 sm:p-6"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-peach-2 via-white to-rose-2 text-coral-ink shadow-[inset_0_1px_0_white,0_8px_20px_-10px_rgb(255_139_116/0.6)] ring-1 ring-white">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-subtle">
                  {product.universe}
                </span>
                <span className="mt-1 block text-lg font-medium leading-snug text-ink">
                  {label}
                </span>
                <span className="mt-1 block text-sm text-muted">{detail}</span>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

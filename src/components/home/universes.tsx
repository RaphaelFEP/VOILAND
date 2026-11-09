import { ArrowUpRight, HeartPulse, Home, ShieldCheck, Sprout } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { productList, type ProductId } from "@/config/products";
import { cn } from "@/lib/utils";

const icons: Record<ProductId, typeof HeartPulse> = {
  mutuelle: HeartPulse,
  prevoyance: ShieldCheck,
  emprunteur: Home,
  epargne: Sprout,
};

const layout: Record<ProductId, string> = {
  mutuelle: "lg:col-span-3",
  prevoyance: "lg:col-span-3",
  emprunteur: "lg:col-span-2",
  epargne: "lg:col-span-4",
};

export function Universes() {
  return (
    <Section id="univers" labelledBy="univers-title">
      <SectionHeading
        id="univers-title"
        eyebrow="Nos expertises"
        title={
          <>
            Quatre univers pour protéger
            <br className="hidden sm:block" /> ce qui compte vraiment.
          </>
        }
        description="De la santé de votre famille à la trajectoire de votre patrimoine, nous analysons vos contrats avec la même exigence."
      />
      <div className="mt-14 grid gap-5 lg:grid-cols-6">
        {productList.map((p, i) => {
          const Icon = icons[p.id];
          return (
            <Reveal key={p.id} delay={i * 0.08} className={cn(layout[p.id])}>
              <Link
                href={p.href}
                data-spotlight=""
                className="glass group flex h-full flex-col rounded-[30px] p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white shadow-[0_10px_24px_-10px_rgb(11_26_51/0.6)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/70 ring-1 ring-line transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-coral-ink">
                  {p.universe}
                </p>
                <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{p.hook}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.targets.slice(0, 4).map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-ink-2 ring-1 ring-line"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-ink">
                  {p.cta}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

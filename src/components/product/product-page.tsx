import { ArrowDown, CalendarDays, Check, ScanSearch } from "lucide-react";
import type { ReactNode } from "react";

import { CtaBand } from "@/components/home/cta-band";
import { Faq } from "@/components/home/faq";
import { Mascot } from "@/components/mascot/mascot";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Container, Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import type { Product } from "@/config/products";
import type { FaqItem } from "@/content/faq";

const howItWorks = [
  { title: "Répondez à quelques questions", text: "Moins de trois minutes, sans document à fournir." },
  { title: "Obtenez une première lecture", text: "Un résultat indicatif immédiat, utile même sans suite." },
  { title: "Recevez une analyse personnalisée", text: "Si vous le souhaitez, j'étudie vos contrats et je vous rappelle sous 24 h." },
];

export function ProductHero({
  product,
  aside,
  ctaHref = "#diagnostic",
  ctaLabel,
}: {
  product: Product;
  aside?: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <section aria-labelledby="product-title" className="relative pb-10 pt-32 sm:pt-36 lg:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: product.navLabel, href: product.href }]} />
        <div className={aside ? "mt-6 grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-12" : "mt-6"}>
          <div className="hero-in">
            <p className="eyebrow">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-coral to-rose" />
              {product.universe}
            </p>
            <h1
              id="product-title"
              className="mt-5 max-w-3xl text-[2.25rem] font-semibold leading-[1.06] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.4rem]"
            >
              {product.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{product.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={ctaHref} icon={<ArrowDown className="h-4 w-4" />}>
                {ctaLabel ?? product.cta}
              </ButtonLink>
              <ButtonLink href="/rendez-vous" variant="glass" icon={<CalendarDays className="h-4 w-4" />}>
                Prendre rendez-vous
              </ButtonLink>
            </div>
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Pour qui ?</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.targets.map((t) => (
                  <li key={t} className="rounded-full bg-white/70 px-3.5 py-1.5 text-sm font-medium text-ink-2 ring-1 ring-line">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {aside}
        </div>
      </Container>
    </section>
  );
}

export function AnalysisAside({ product }: { product: Product }) {
  return (
    <div className="space-y-5 lg:sticky lg:top-28">
      <div className="glass rounded-[28px] p-6" data-spotlight="">
        <div className="flex items-center gap-4">
          <div className="h-20 w-[66px] shrink-0">
            <Mascot className="h-full w-full" wave={false} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Ce que j&apos;analyse</p>
            <p className="text-xs text-muted">Lors de votre étude personnalisée</p>
          </div>
        </div>
        <ul className="mt-5 space-y-3">
          {product.analysis.map((a) => (
            <li key={a} className="flex items-start gap-3 text-sm text-muted">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-white">
                <Check className="h-3 w-3" aria-hidden />
              </span>
              {a}
            </li>
          ))}
        </ul>
      </div>
      <div className="glass glass-soft rounded-[28px] p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <ScanSearch className="h-4 w-4 text-coral-ink" aria-hidden /> Comment ça marche
        </p>
        <ol className="mt-4 space-y-4">
          {howItWorks.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-ink ring-1 ring-line">
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">{s.title}</span>
                <span className="block text-xs leading-relaxed text-muted">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function DiagnosticSection({
  product,
  funnel,
  title = "Votre diagnostic en quelques étapes",
}: {
  product: Product;
  funnel: ReactNode;
  title?: string;
}) {
  return (
    <Section labelledBy="diag-title" className="pt-6 sm:pt-10">
      <h2 id="diag-title" className="sr-only">
        {title}
      </h2>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <Reveal y={16}>{funnel}</Reveal>
        <AnalysisAside product={product} />
      </div>
    </Section>
  );
}

export function ProductClosing({ faq, faqTitle }: { faq: FaqItem[]; faqTitle?: string }) {
  return (
    <>
      <Faq items={faq} title={faqTitle} />
      <CtaBand />
    </>
  );
}

import { BadgeCheck, FileSearch, Scale } from "lucide-react";

import { ProductClosing, ProductHero } from "@/components/product/product-page";
import { DocumentsChecklist, EmprunteurFunnel } from "@/components/simulators/emprunteur-funnel";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { products } from "@/config/products";
import { productFaq } from "@/content/faq";
import { productMetadata } from "@/lib/metadata";

const product = products.emprunteur;
export const metadata = productMetadata(product);

const steps = [
  {
    icon: FileSearch,
    title: "Estimation en 1 minute",
    text: "Montant, date de début, durée, âge et statut fumeur suffisent pour une première fourchette d'économie.",
  },
  {
    icon: Scale,
    title: "Vérification sur vos échéances",
    text: "À partir de votre tableau d'amortissement, nous recalculons le coût restant réel de votre assurance actuelle.",
  },
  {
    icon: BadgeCheck,
    title: "Devis assureur et formalités",
    text: "Nous confirmons l'économie avec un devis d'assurance déléguée à garanties équivalentes, puis gérons la substitution auprès de votre banque.",
  },
];

export default function EmprunteurPage() {
  return (
    <>
      <ProductHero
        product={product}
        aside={<EmprunteurFunnel className="hero-in" />}
      />
      <Section labelledBy="etude-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              id="etude-title"
              eyebrow="Comment ça marche"
              title="De l'estimation à l'économie confirmée."
              description="Trois étapes, de la fourchette indicative au montant confirmé par un assureur. La loi vous permet de changer d'assurance emprunteur à tout moment, à garanties équivalentes."
            />
            <div className="mt-10">
              <DocumentsChecklist />
            </div>
          </div>
          <ol className="grid gap-4 self-start">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <div className="glass flex gap-5 rounded-[28px] p-6" data-spotlight="">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-coral-ink">Étape {i + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold text-ink">{title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>
      <ProductClosing faq={productFaq.emprunteur} faqTitle="Assurance emprunteur : vos questions" />
    </>
  );
}

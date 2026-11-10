import { Accordion } from "@/components/ui/accordion";
import { Glass } from "@/components/ui/glass";
import { Section, SectionHeading } from "@/components/ui/section";
import { JsonLd, faqJsonLd } from "@/components/seo/json-ld";
import type { FaqItem } from "@/content/faq";

export function Faq({
  items,
  id = "faq",
  title = "Vos questions, nos réponses claires.",
}: {
  items: FaqItem[];
  id?: string;
  title?: string;
}) {
  return (
    <Section id={id} labelledBy={`${id}-title`}>
      <JsonLd data={faqJsonLd(items)} />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <SectionHeading
          id={`${id}-title`}
          eyebrow="Questions fréquentes"
          title={title}
          description="Une question précise sur votre situation ? Posez-la lors d'un rendez-vous : je prends le temps d'y répondre."
        />
        <Glass className="px-6 py-2 sm:px-8" spotlight={false}>
          <Accordion items={items} />
        </Glass>
      </div>
    </Section>
  );
}

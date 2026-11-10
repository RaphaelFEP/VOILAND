import { ProductClosing, ProductHero } from "@/components/product/product-page";
import { EpargneExperience } from "@/components/simulators/epargne-experience";
import { Section, SectionHeading } from "@/components/ui/section";
import { ProductVisual } from "@/components/product/product-visual";
import { products } from "@/config/products";
import { productFaq } from "@/content/faq";
import { productMetadata } from "@/lib/metadata";

const product = products.epargne;
export const metadata = productMetadata(product);

export default function EpargnePage() {
  return (
    <>
      <ProductHero product={product} aside={<ProductVisual product={product} duration="2 min" />} ctaHref="#simulateur" ctaLabel="Simuler ma trajectoire" />
      <Section id="simulateur" labelledBy="sim-title" className="pt-6 sm:pt-10">
        <SectionHeading
          id="sim-title"
          eyebrow="Simulateur de projection"
          title="Visualisez la trajectoire de votre épargne."
          description="Capital initial, épargne mensuelle, horizon et taux : voyez en un instant ce que deviennent vos versements. Résultats illustratifs, sans promesse de rendement."
        />
        <EpargneExperience />
      </Section>
      <ProductClosing faq={productFaq.epargne} faqTitle="Assurance-vie et PER : vos questions" />
    </>
  );
}

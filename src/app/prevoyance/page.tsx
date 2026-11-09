import { DiagnosticSection, ProductClosing, ProductHero } from "@/components/product/product-page";
import { PrevoyanceFunnel } from "@/components/simulators/prevoyance-funnel";
import { ProductVisual } from "@/components/product/product-visual";
import { products } from "@/config/products";
import { productFaq } from "@/content/faq";
import { productMetadata } from "@/lib/metadata";

const product = products.prevoyance;
export const metadata = productMetadata(product);

export default function PrevoyancePage() {
  return (
    <>
      <ProductHero product={product} aside={<ProductVisual product={product} duration="3 min" />} />
      <DiagnosticSection product={product} funnel={<PrevoyanceFunnel />} />
      <ProductClosing faq={productFaq.prevoyance} faqTitle="Prévoyance : vos questions" />
    </>
  );
}

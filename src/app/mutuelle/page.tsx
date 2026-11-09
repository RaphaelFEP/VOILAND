import { DiagnosticSection, ProductClosing, ProductHero } from "@/components/product/product-page";
import { MutuelleFunnel } from "@/components/simulators/mutuelle-funnel";
import { ProductVisual } from "@/components/product/product-visual";
import { products } from "@/config/products";
import { productFaq } from "@/content/faq";
import { productMetadata } from "@/lib/metadata";

const product = products.mutuelle;
export const metadata = productMetadata(product);

export default function MutuellePage() {
  return (
    <>
      <ProductHero product={product} aside={<ProductVisual product={product} duration="2 min" />} />
      <DiagnosticSection product={product} funnel={<MutuelleFunnel />} />
      <ProductClosing faq={productFaq.mutuelle} faqTitle="Mutuelle santé : vos questions" />
    </>
  );
}

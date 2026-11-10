import { Advisor } from "@/components/home/advisor";
import { CtaBand } from "@/components/home/cta-band";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Method } from "@/components/home/method";
import { ObjectivePicker } from "@/components/home/objective-picker";
import { Professions } from "@/components/home/professions";
import { Universes } from "@/components/home/universes";
import { Why } from "@/components/home/why";
import { JsonLd } from "@/components/seo/json-ld";
import { productList } from "@/config/products";
import { siteConfig } from "@/config/site";
import { homeFaq } from "@/content/faq";

export default function HomePage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    areaServed: "FR",
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    ...(siteConfig.company.address ? { address: siteConfig.company.address } : {}),
    makesOffer: productList.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: p.cardLabel, url: `${siteConfig.url}${p.href}` },
    })),
  };

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <Hero />
      <ObjectivePicker />
      <Universes />
      <Why />
      <Advisor />
      <Method />
      <Professions />
      <Faq items={homeFaq} />
      <CtaBand />
    </>
  );
}

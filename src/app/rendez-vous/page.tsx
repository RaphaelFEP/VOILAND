import { Check } from "lucide-react";

import { BookingEmbed } from "@/components/contact/booking-embed";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Prendre rendez-vous",
  description:
    "Réservez un échange avec Enzo Voiland pour faire le point sur votre mutuelle, votre prévoyance, votre assurance emprunteur ou votre épargne.",
  path: "/rendez-vous",
});

const expect = [
  "Un point complet sur votre situation et vos objectifs",
  "Une lecture de vos contrats en cours, si vous le souhaitez",
  "Des pistes concrètes et les prochaines étapes",
];

export default function RendezVousPage() {
  return (
    <section aria-labelledby="rdv-title" className="pb-16 pt-32 sm:pt-36 lg:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: "Prendre rendez-vous", href: "/rendez-vous" }]} />
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,680px)]">
          <div className="hero-in">
            <p className="eyebrow">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-coral to-rose" />
              Rendez-vous
            </p>
            <h1 id="rdv-title" className="mt-5 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
              Choisissez le moment qui vous convient.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Un échange avec {siteConfig.advisor.name} pour faire le point sur votre situation,
              sans engagement.
            </p>
            <ul className="mt-8 space-y-3">
              {expect.map((e) => (
                <li key={e} className="flex items-start gap-3 text-muted">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <BookingEmbed />
        </div>
      </Container>
    </section>
  );
}

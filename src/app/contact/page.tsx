import { CalendarDays, Mail, Phone, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "@/components/contact/contact-form";
import { Mascot } from "@/components/mascot/mascot";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/ui/section";
import { ToComplete } from "@/components/ui/to-complete";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contactez Voiland Finances & Patrimoine : posez votre question, demandez une analyse de vos contrats ou réservez un rendez-vous.",
  path: "/contact",
});

export default function ContactPage() {
  const { contact, company } = siteConfig;
  return (
    <section aria-labelledby="contact-title" className="pb-16 pt-32 sm:pt-36 lg:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,620px)]">
          <div className="hero-in">
            <p className="eyebrow">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-coral to-rose" />
              Contact
            </p>
            <h1 id="contact-title" className="mt-5 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">
              Parlons de votre situation.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Une question sur un contrat, une analyse à demander ou un projet à préparer :
              écrivez-moi ou réservez directement un créneau. Je vous rappelle sous 24 h.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Image
                src="/brand/enzo-voiland-160.webp"
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
              />
              <span>
                <span className="block font-semibold text-ink">{siteConfig.advisor.name}</span>
                <span className="block text-sm text-muted">{siteConfig.advisor.role}</span>
              </span>
            </div>

            <ul className="mt-8 space-y-3">
              <li className="glass flex items-center gap-4 rounded-3xl p-4">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white"><Phone className="h-4 w-4" aria-hidden /></span>
                <span className="text-sm">
                  <span className="block font-medium text-ink">Téléphone</span>
                  <span className="text-muted">
                    {contact.phone && contact.phoneHref ? <a href={`tel:${contact.phoneHref}`}>{contact.phone}</a> : <ToComplete value={null} label="téléphone" />}
                  </span>
                </span>
              </li>
              <li className="glass flex items-center gap-4 rounded-3xl p-4">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white"><Mail className="h-4 w-4" aria-hidden /></span>
                <span className="text-sm">
                  <span className="block font-medium text-ink">E-mail</span>
                  <span className="text-muted">
                    {contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : <ToComplete value={null} label="e-mail" />}
                  </span>
                </span>
              </li>
              <li className="glass flex items-center gap-4 rounded-3xl p-4">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white"><Clock className="h-4 w-4" aria-hidden /></span>
                <span className="text-sm">
                  <span className="block font-medium text-ink">{company.address ? "Horaires & adresse" : "Horaires"}</span>
                  <span className="text-muted">
                    {contact.openingHours}
                    {company.address ? ` · ${company.address}` : ""}
                  </span>
                </span>
              </li>
            </ul>

            <Link href="/rendez-vous" className="btn btn-glass mt-6">
              <CalendarDays className="h-4 w-4" aria-hidden /> Réserver un rendez-vous
            </Link>

            <div className="mt-10 hidden h-56 w-44 lg:block">
              <Mascot className="h-full w-full" />
            </div>
          </div>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

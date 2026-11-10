import { BadgeCheck, CalendarDays, Clock3, Phone } from "lucide-react";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";

/** Présentation du conseiller : un visage et un engagement clair. */
export function Advisor() {
  const { advisor, contact, regulatory } = siteConfig;
  return (
    <Section id="conseiller" labelledBy="conseiller-title">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-[420px]">
          <div aria-hidden className="absolute -inset-6 rounded-[44px] bg-gradient-to-br from-peach/70 via-rose-2/50 to-transparent blur-2xl" />
          <div className="glass relative overflow-hidden rounded-[36px] p-2.5">
            <Image
              src="/brand/enzo-voiland.webp"
              alt={`${advisor.name}, ${advisor.role.toLowerCase()}`}
              width={640}
              height={640}
              sizes="(min-width: 1024px) 420px, 90vw"
              className="aspect-square w-full rounded-[28px] object-cover"
            />
            <div className="glass glass-strong absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white">
                <BadgeCheck className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-ink">Immatriculé à l&apos;ORIAS</span>
                <span className="block text-muted">n° {regulatory.orias} · {regulatory.status}</span>
              </span>
            </div>
          </div>
        </Reveal>

        <div>
          <p className="eyebrow">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-coral to-rose" />
            Votre conseiller
          </p>
          <h2 id="conseiller-title" className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-[2.6rem]">
            {advisor.name}, un interlocuteur unique pour vos protections et votre épargne.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Je vous accompagne personnellement sur votre mutuelle, votre prévoyance, votre assurance
            emprunteur, votre assurance-vie et votre PER. Je prends le temps de comprendre votre
            situation, je vous explique clairement les garanties, et je reste à vos côtés dans la durée.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            <li className="glass flex items-center gap-3 rounded-2xl p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-peach-2 text-coral-ink">
                <Phone className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-ink">Je vous rappelle sous 24 h</span>
                <span className="block text-muted">après chaque demande</span>
              </span>
            </li>
            <li className="glass flex items-center gap-3 rounded-2xl p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-peach-2 text-coral-ink">
                <Clock3 className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-ink">Disponible</span>
                <span className="block text-muted">{contact.openingHours}</span>
              </span>
            </li>
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/rendez-vous" icon={<CalendarDays className="h-4 w-4" />}>
              Prendre rendez-vous avec Enzo
            </ButtonLink>
            {contact.phoneHref ? (
              <a href={`tel:${contact.phoneHref}`} className="btn btn-glass">
                <Phone className="h-4 w-4" aria-hidden /> {contact.phone}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}

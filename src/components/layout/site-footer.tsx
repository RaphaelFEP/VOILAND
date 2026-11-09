import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ConsentPreferencesButton } from "@/components/consent/consent-banner";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/section";
import { ToComplete } from "@/components/ui/to-complete";
import { legalNav, productList } from "@/config/products";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const { regulatory, company, contact } = siteConfig;
  return (
    <footer className="relative mt-12 pb-8">
      <Container>
        <div className="glass glass-strong rounded-[32px] p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                Cabinet spécialisé en assurances de personnes, épargne et
                préparation de la retraite. Une approche personnalisée et un
                accompagnement dans la durée.
              </p>
              <dl className="mt-6 space-y-1.5 text-sm text-muted">
                <div className="flex flex-wrap gap-x-1.5">
                  <dt className="font-medium text-ink">Conseiller :</dt>
                  <dd>{siteConfig.advisor.name}</dd>
                </div>
                <div className="flex flex-wrap gap-x-1.5">
                  <dt className="font-medium text-ink">E-mail :</dt>
                  <dd>
                    {contact.email ? (
                      <a className="underline-offset-2 hover:underline" href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                    ) : (
                      <ToComplete value={null} label="e-mail" />
                    )}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-1.5">
                  <dt className="font-medium text-ink">Téléphone :</dt>
                  <dd>
                    {contact.phone && contact.phoneHref ? (
                      <a className="underline-offset-2 hover:underline" href={`tel:${contact.phoneHref}`}>
                        {contact.phone}
                      </a>
                    ) : (
                      <ToComplete value={null} label="téléphone" />
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <nav aria-labelledby="f-solutions">
              <h2 id="f-solutions" className="text-sm font-semibold text-ink">
                Solutions
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {productList.map((p) => (
                  <li key={p.id}>
                    <Link href={p.href} className="text-muted transition-colors hover:text-ink">
                      {p.cardLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="f-cabinet">
              <h2 id="f-cabinet" className="text-sm font-semibold text-ink">
                Cabinet
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/#methode" className="text-muted hover:text-ink">
                    Notre méthode
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="text-muted hover:text-ink">
                    Questions fréquentes
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted hover:text-ink">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rendez-vous"
                    className="inline-flex items-center gap-1 font-medium text-ink"
                  >
                    Prendre rendez-vous <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-labelledby="f-legal">
              <h2 id="f-legal" className="text-sm font-semibold text-ink">
                Informations légales
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {legalNav.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <ConsentPreferencesButton className="text-muted hover:text-ink" />
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-subtle">
            <p>
              <ToComplete value={company.legalName} label="raison sociale" /> —{" "}
              <ToComplete value={regulatory.status} label="statut réglementaire" /> —
              immatriculé à l&apos;ORIAS sous le n°{" "}
              <ToComplete value={regulatory.orias} label="numéro ORIAS" /> (www.orias.fr) —
              SIREN <ToComplete value={company.siren} label="SIREN" />. Activité soumise au
              contrôle de l&apos;Autorité de Contrôle Prudentiel et de Résolution (ACPR).
            </p>
            <p className="mt-3">
              Les simulateurs et diagnostics de ce site sont fournis à titre
              indicatif et pédagogique. Ils ne constituent ni un conseil, ni une
              offre, ni un engagement. Les performances passées ne préjugent pas
              des performances futures ; les supports en unités de compte
              présentent un risque de perte en capital.
            </p>
            <p className="mt-3">© {siteConfig.name}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

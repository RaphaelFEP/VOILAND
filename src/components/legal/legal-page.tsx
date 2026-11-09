import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/ui/section";

export function LegalPage({
  title,
  href,
  children,
  updated,
}: {
  title: string;
  href: string;
  children: ReactNode;
  updated?: string;
}) {
  return (
    <section aria-labelledby="legal-title" className="pb-16 pt-32 sm:pt-36 lg:pt-40">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ name: title, href }]} />
        <h1 id="legal-title" className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
          {title}
        </h1>
        {updated ? <p className="mt-3 text-sm text-subtle">Dernière mise à jour : {updated}</p> : null}
        <div role="note" className="mt-8 flex gap-3 rounded-3xl bg-[#fff6ef] p-5 text-sm leading-relaxed text-muted ring-1 ring-coral/25">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral-ink" aria-hidden />
          <p>
            <strong className="text-ink">Modèle à vérifier avant publication.</strong> Ce document est
            un modèle de travail : les mentions signalées « À compléter » doivent être renseignées et
            l&apos;ensemble doit être validé par un professionnel du droit ou de la conformité au regard
            de la situation exacte du cabinet.
          </p>
        </div>
        <article className="glass glass-strong prose-legal mt-8 rounded-[32px] p-6 sm:p-10">{children}</article>
      </Container>
    </section>
  );
}

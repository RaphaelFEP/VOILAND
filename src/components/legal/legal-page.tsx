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
        <article className="glass glass-strong prose-legal mt-10 rounded-[32px] p-6 sm:p-10">{children}</article>
      </Container>
    </section>
  );
}

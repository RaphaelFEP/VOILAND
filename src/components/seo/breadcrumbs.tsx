import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { JsonLd } from "./json-ld";

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Accueil", href: "/" }, ...items];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((i, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: i.name,
            item: `${siteConfig.url}${i.href === "/" ? "" : i.href}`,
          })),
        }}
      />
      <nav aria-label="Fil d'Ariane">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          {all.map((i, idx) => (
            <li key={i.href} className="flex items-center gap-1.5">
              {idx > 0 ? <ChevronRight className="h-3.5 w-3.5 text-subtle" aria-hidden /> : null}
              {idx === all.length - 1 ? (
                <span aria-current="page" className="font-medium text-ink">
                  {i.name}
                </span>
              ) : (
                <Link href={i.href} className="hover:text-ink">
                  {i.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

import type { Metadata } from "next";

import type { Product } from "@/config/products";

export function pageMetadata({
  title,
  description,
  path,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const productMetadata = (p: Product) =>
  pageMetadata({ title: p.seoTitle, description: p.seoDescription, path: p.href });

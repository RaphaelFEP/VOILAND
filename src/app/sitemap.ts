import type { MetadataRoute } from "next";

import { legalNav, productList } from "@/config/products";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = siteConfig.contentUpdatedAt;
  const url = (p: string) => `${siteConfig.url}${p === "/" ? "" : p}`;
  return [
    { url: url("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    ...productList.map((p) => ({
      url: url(p.href),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: url("/contact"), lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/rendez-vous"), lastModified, changeFrequency: "yearly", priority: 0.7 },
    ...legalNav.map((l) => ({
      url: url(l.href),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}

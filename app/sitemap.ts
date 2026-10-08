import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { alternateLanguages, SEO, SITE_URL, type PageKey } from "@/lib/seo";
import { LEGAL_SLUGS } from "@/lib/legal";

/** The catalog changes whenever a product is edited in the admin panel, so it
 *  is built per request rather than cached for an hour. */
export const dynamic = "force-dynamic";

const PAGE_KEYS: PageKey[] = [
  "home",
  "about",
  "initiative",
  "store",
  "contact",
  "list",
];

function absoluteLanguages(path: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(alternateLanguages(path)).map(([code, value]) => [
      code,
      `${SITE_URL}${value}`,
    ]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const main = locales.flatMap((locale) =>
    PAGE_KEYS.map((key) => {
      const { path } = SEO[locale].pages[key];
      const isHome = key === "home";

      return {
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: isHome ? "weekly" : "monthly",
        priority: isHome ? 1 : 0.7,
        alternates: { languages: absoluteLanguages(path) },
      } satisfies MetadataRoute.Sitemap[number];
    }),
  );

  /* Product pages, keyed by slug; hidden products stay out of the index. */
  const products = await prisma.product.findMany({
    where: { visible: true },
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "asc" },
  });

  const productPages = locales.flatMap((locale) =>
    products.map((product) => {
      const path = `/store/${product.id}`;

      return {
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: absoluteLanguages(path) },
      } satisfies MetadataRoute.Sitemap[number];
    }),
  );

  const legal = locales.flatMap((locale) =>
    LEGAL_SLUGS.map((slug) => {
      const path = `/legal/${slug}`;

      return {
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.3,
        alternates: { languages: absoluteLanguages(path) },
      } satisfies MetadataRoute.Sitemap[number];
    }),
  );

  return [...main, ...productPages, ...legal];
}

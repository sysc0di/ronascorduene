import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { alternateLanguages, SEO, SITE_URL, type PageKey } from "@/lib/seo";

const PAGE_KEYS: PageKey[] = ["home", "about", "store", "contact", "list"];

function absoluteLanguages(path: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(alternateLanguages(path)).map(([code, value]) => [
      code,
      `${SITE_URL}${value}`,
    ]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) =>
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
}

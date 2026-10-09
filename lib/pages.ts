import { defaultLocale, type Locale } from "@/lib/i18n";
import { PAGES } from "@/lib/pages-data";
import { pickTranslation } from "@/lib/product-text";

/**
 * Storefront CMS content layer.
 *
 * A `Page` is a named collection of ordered `PageSection`s. Section text is
 * stored per locale; `image`/`href` are shared. The frontend renders sections
 * through a type→component registry, so a new page or block is data, not
 * bespoke code. Metadata is code-owned (see `lib/seo.ts`).
 *
 * The content itself is embedded in `lib/pages-data.ts` rather than read from
 * the database, so pages are edited in code and are no longer editable in the
 * admin panel. This module resolves the raw data for one locale.
 */

export type SectionItem = {
  title: string;
  body: string;
  href: string;
};

/** A section resolved for one locale, ready to render. */
export type ResolvedSection = {
  id: string;
  key: string;
  type: string;
  position: number;
  image: string;
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  items: SectionItem[];
};

export type ResolvedPage = {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  sections: ResolvedSection[];
};

/** Resolved content for one locale, with dictionary-style fallbacks. */
export async function getPage(
  key: string,
  locale: Locale = defaultLocale,
): Promise<ResolvedPage | null> {
  const page = PAGES[key];

  if (!page) return null;

  const translation = pickTranslation(page.translations, locale);

  return {
    key: page.key,
    label: page.label,
    title: translation?.title ?? "",
    subtitle: translation?.subtitle ?? "",
    sections: page.sections.map((section) => {
      const text = pickTranslation(section.translations, locale);

      return {
        id: section.key,
        key: section.key,
        type: section.type,
        position: section.position,
        image: section.image,
        href: section.href,
        eyebrow: text?.eyebrow ?? "",
        title: text?.title ?? "",
        body: text?.body ?? "",
        ctaLabel: text?.ctaLabel ?? "",
        items: text?.items ?? [],
      };
    }),
  };
}

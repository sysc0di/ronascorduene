import { defaultLocale, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { pickTranslation } from "@/lib/product-text";

/**
 * Storefront CMS content layer.
 *
 * A `Page` is a named collection of ordered `PageSection`s. Section text is
 * stored per locale; `image`/`href` are shared. The frontend renders sections
 * through a type→component registry, so a new page or block is data, not
 * bespoke code. Metadata is code-owned (see `lib/seo.ts`) and is deliberately
 * not read from the database.
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

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toItems(value: unknown): SectionItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (typeof entry !== "object" || entry === null) return null;

      const record = entry as Record<string, unknown>;
      const title = toStringValue(record.title);
      const body = toStringValue(record.body);
      const href = toStringValue(record.href);

      if (!title && !body && !href) return null;

      return { title, body, href };
    })
    .filter((item): item is SectionItem => item !== null);
}

const pageInclude = {
  translations: true,
  sections: {
    orderBy: { position: "asc" },
    include: { translations: true },
  },
} as const;

/** Resolved content for one locale, with dictionary-style fallbacks. */
export async function getPage(
  key: string,
  locale: Locale = defaultLocale,
): Promise<ResolvedPage | null> {
  const page = await prisma.page.findUnique({
    where: { key },
    include: pageInclude,
  });

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
        id: section.id,
        key: section.key,
        type: section.type,
        position: section.position,
        image: section.image,
        href: section.href,
        eyebrow: text?.eyebrow ?? "",
        title: text?.title ?? "",
        body: text?.body ?? "",
        ctaLabel: text?.ctaLabel ?? "",
        items: toItems(text?.items),
      };
    }),
  };
}

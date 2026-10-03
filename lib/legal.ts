/**
 * Version of the legal documents a customer agrees to when placing an order.
 * Bump this whenever the Distance Sales Agreement or the Pre-Information Form
 * text changes, so every order records the exact version that was accepted.
 */
export const LEGAL_DOCUMENT_VERSION = "2026-10-03";

/** Legal documents shown under /[lang]/legal/<slug>. */
export const LEGAL_SLUGS = [
  "privacy",
  "kvkk",
  "cookies",
  "terms",
  "distance-sales",
  "pre-information",
  "returns",
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

/** CMS page key for a legal slug, e.g. "legal/privacy". */
export function legalPageKey(slug: string): string {
  return `legal/${slug}`;
}

export type LegalLabelKey =
  | "label"
  | "privacy"
  | "kvkk"
  | "cookies"
  | "terms"
  | "distanceSales"
  | "preInformation"
  | "returns";

/** Footer link order and dictionary keys, kept in one place. */
export const LEGAL_LINKS: {
  slug: LegalSlug;
  labelKey: Exclude<LegalLabelKey, "label">;
}[] = [
  { slug: "privacy", labelKey: "privacy" },
  { slug: "kvkk", labelKey: "kvkk" },
  { slug: "cookies", labelKey: "cookies" },
  { slug: "terms", labelKey: "terms" },
  { slug: "distance-sales", labelKey: "distanceSales" },
  { slug: "pre-information", labelKey: "preInformation" },
  { slug: "returns", labelKey: "returns" },
];

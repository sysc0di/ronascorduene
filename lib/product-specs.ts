/**
 * Guards for the `ProductTranslation.technicalDetails` JSON column.
 *
 * The column is edited in the admin panel and rendered on the storefront, so
 * the storefront reads it defensively: only well-formed `{ label, value }`
 * string pairs survive, which keeps one bad row from breaking a product page.
 * Free of server-only imports so client components can use it too.
 */

import type { ProductSpec } from "@/lib/order-types";

export const MAX_PRODUCT_SPECS = 24;
export const MAX_PRODUCT_SPEC_LENGTH = 120;

export function parseProductSpecs(value: unknown): ProductSpec[] {
  if (!Array.isArray(value)) return [];

  const specs: ProductSpec[] = [];

  for (const entry of value) {
    if (specs.length >= MAX_PRODUCT_SPECS) break;

    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      continue;
    }

    const { label, value: specValue } = entry as Record<string, unknown>;

    if (typeof label !== "string" || typeof specValue !== "string") continue;

    const trimmedLabel = label.trim();
    const trimmedValue = specValue.trim();

    /* A row without both halves is noise from an unfinished draft. */
    if (!trimmedLabel || !trimmedValue) continue;

    specs.push({
      label: trimmedLabel.slice(0, MAX_PRODUCT_SPEC_LENGTH),
      value: trimmedValue.slice(0, MAX_PRODUCT_SPEC_LENGTH),
    });
  }

  return specs;
}

import { defaultLocale, type Locale } from "@/lib/i18n";
import { decimalToNumber } from "@/lib/price";
import { parseProductSpecs } from "@/lib/product-specs";
import { pickTranslation } from "@/lib/product-text";
import { prisma } from "@/lib/prisma";

import type { CatalogProduct, ProductDetail } from "@/lib/order-types";

const translationTextSelect = {
  locale: true,
  name: true,
  description: true,
} as const;

const catalogSelect = {
  id: true,
  family: true,
  category: true,
  image: true,
  material: true,
  construction: true,
  finish: true,
  priceUsd: true,
  discountedPriceUsd: true,
  discountPercentUsd: true,
  priceTry: true,
  discountedPriceTry: true,
  discountPercentTry: true,
  translations: {
    select: translationTextSelect,
  },
} as const;

/** The detail page also needs the per-language technical detail rows. */
const detailSelect = {
  ...catalogSelect,
  translations: {
    select: { ...translationTextSelect, technicalDetails: true },
  },
} as const;

type SelectedTranslation = {
  locale: string;
  name: string;
  description: string;
};

function toCatalogProduct(
  product: {
    id: string;
    family: string;
    category: string;
    image: string;
    material: string;
    construction: string;
    finish: string;
    priceUsd: unknown;
    discountedPriceUsd: unknown;
    discountPercentUsd: number | null;
    priceTry: unknown;
    discountedPriceTry: unknown;
    discountPercentTry: number | null;
  },
  translation: SelectedTranslation | undefined,
): CatalogProduct {
  return {
    id: product.id,
    name: translation?.name ?? "",
    family: product.family,
    category: product.category,
    description: translation?.description ?? "",
    image: product.image,
    material: product.material,
    construction: product.construction,
    finish: product.finish,
    priceUsd: decimalToNumber(product.priceUsd),
    discountedPriceUsd: decimalToNumber(product.discountedPriceUsd),
    discountPercentUsd: product.discountPercentUsd,
    priceTry: decimalToNumber(product.priceTry),
    discountedPriceTry: decimalToNumber(product.discountedPriceTry),
    discountPercentTry: product.discountPercentTry,
  };
}

/**
 * Public catalog: hidden products never reach the storefront, so a product
 * can be pulled from the site without deleting it. Product text is resolved
 * for the requested language (with fallback) so the storefront never talks
 * to the UI dictionaries for product content.
 */
export async function getCatalog(
  locale: Locale = defaultLocale,
): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: { visible: true },
    select: catalogSelect,
    orderBy: [{ createdAt: "asc" }],
  });

  return products.map((product) =>
    toCatalogProduct(
      product,
      pickTranslation(product.translations, locale),
    ),
  );
}

/**
 * A single visible product for its detail page, with the technical details
 * of the same translation the rest of the copy comes from. `null` means the
 * product is missing or hidden, which the page turns into a 404.
 */
export async function getProduct(
  id: string,
  locale: Locale = defaultLocale,
): Promise<ProductDetail | null> {
  const product = await prisma.product.findFirst({
    where: { id, visible: true },
    select: detailSelect,
  });

  if (!product) return null;

  const translation = pickTranslation(product.translations, locale);

  return {
    ...toCatalogProduct(product, translation),
    technicalDetails: parseProductSpecs(translation?.technicalDetails),
  };
}

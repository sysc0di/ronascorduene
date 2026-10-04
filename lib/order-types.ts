/**
 * Shapes shared by the server pages and the client components. Kept free of
 * server-only imports so client bundles can use them.
 */

export type CatalogProduct = {
  id: string;
  name: string;
  family: string;
  category: string;
  description: string;
  image: string;
  material: string;
  construction: string;
  finish: string;
  priceUsd: number | null;
  discountedPriceUsd: number | null;
  discountPercentUsd: number | null;
  priceTry: number | null;
  discountedPriceTry: number | null;
  discountPercentTry: number | null;
};

/** One "label: value" row of a product's technical details. */
export type ProductSpec = {
  label: string;
  value: string;
};

/** Everything the catalog knows, plus the per-language technical details. */
export type ProductDetail = CatalogProduct & {
  technicalDetails: ProductSpec[];
};

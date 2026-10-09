/**
 * Shapes shared by the server pages and the client components. Kept free of
 * server-only imports so client bundles can use them.
 */

/** One "label: value" row of a product's technical details. */
export type ProductSpec = {
  label: string;
  value: string;
};

export type CatalogProduct = {
  id: string;
  name: string;
  family: string;
  category: string;
  description: string;
  image: string;
  /** Per-language technical details; also the source of the store filters. */
  specs: ProductSpec[];
  priceUsd: number | null;
  discountedPriceUsd: number | null;
  discountPercentUsd: number | null;
  priceTry: number | null;
  discountedPriceTry: number | null;
  discountPercentTry: number | null;
};

/** Everything the catalog knows about a product, used on its detail page. */
export type ProductDetail = CatalogProduct;

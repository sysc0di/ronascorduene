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
};

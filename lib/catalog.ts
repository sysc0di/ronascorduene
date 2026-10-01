import { prisma } from "@/lib/prisma";

import type { CatalogProduct } from "@/lib/order-types";

const catalogSelect = {
  id: true,
  name: true,
  family: true,
  category: true,
  description: true,
  image: true,
  material: true,
  construction: true,
  finish: true,
} as const;

/**
 * Public catalog: hidden products never reach the storefront, so a product
 * can be pulled from the site without deleting it.
 */
export async function getCatalog(): Promise<CatalogProduct[]> {
  return prisma.product.findMany({
    where: { visible: true },
    select: catalogSelect,
    orderBy: [{ createdAt: "asc" }],
  });
}

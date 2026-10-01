import { PageHeader } from "@/components/admin/AdminShell";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { prisma } from "@/lib/prisma";
import { productSelect } from "@/lib/products";

export const metadata = { title: "Products · Admin" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: productSelect,
  });

  return (
    <>
      <PageHeader
        title="Products"
        description="Add, edit, hide or remove items shown in the storefront catalog."
      />

      <ProductsTable
        initialProducts={products.map((product) => ({
          ...product,
          family: product.family ?? "",
          description: product.description ?? null,
          image: product.image ?? null,
          material: product.material ?? null,
          construction: product.construction ?? null,
          finish: product.finish ?? null,
        }))}
      />
    </>
  );
}

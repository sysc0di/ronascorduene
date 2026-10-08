import type { Metadata } from "next";

import ProductList from "./ProductList";

import { getDictionary, getLocaleFor } from "../dictionaries";
import { getCatalog } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

/** Copy is edited in the admin panel, so the page renders per request.
 *  A prerendered build would keep serving whatever text existed when the
 *  site was last deployed. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/list">): Promise<Metadata> {
  const { lang } = await params;

  return buildMetadata({ locale: getLocaleFor(lang), page: "list" });
}

export default async function ListPage({
  params,
}: PageProps<"/[lang]/list">) {
  const { lang } = await params;
  const locale = getLocaleFor(lang);
  const dict = await getDictionary();

  const products = await getCatalog(locale);

  return (
    <ProductList
      locale={locale}
      dict={dict}
      products={products}
    />
  );
}

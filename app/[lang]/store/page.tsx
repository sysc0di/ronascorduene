import type { Metadata } from "next";

import StoreCatalog from "./StoreCatalog";

import { getCatalog } from "@/lib/catalog";
import { getDictionary, getLocaleFor } from "../dictionaries";
import { buildMetadata } from "@/lib/seo";

/** Products come from the database, so the catalog is rendered per request. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/store">): Promise<Metadata> {
  const { lang } = await params;

  return buildMetadata({ locale: getLocaleFor(lang), page: "store" });
}

export default async function StorePage({
  params,
}: PageProps<"/[lang]/store">) {
  const { lang } = await params;
  const locale = getLocaleFor(lang);

  const [products, dict] = await Promise.all([
    getCatalog(locale),
    getDictionary(),
  ]);

  return (
    <StoreCatalog
      products={products}
      locale={locale}
      dict={dict}
    />
  );
}

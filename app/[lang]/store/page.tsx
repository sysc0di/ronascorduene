import StoreCatalog from "./StoreCatalog";

import { getCatalog } from "@/lib/catalog";
import { getDictionary, getLocaleFor } from "../dictionaries";

/** Products come from the database, so the catalog is rendered per request. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/store">) {
  const { lang } = await params;
  const dict = await getDictionary();

  return {
    title: dict.store.catalog,
    description: dict.store.description,
    alternates: {
      canonical: `/${lang}/store`,
      languages: { en: "/en/store", tr: "/tr/store", ku: "/ku/store" },
    },
  };
}

export default async function StorePage({
  params,
}: PageProps<"/[lang]/store">) {
  const { lang } = await params;
  const locale = getLocaleFor(lang);

  const [products, dict] = await Promise.all([
    getCatalog(),
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

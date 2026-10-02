import ProductList from "./ProductList";

import { getDictionary, getLocaleFor } from "../dictionaries";
import { getCatalog } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/list">) {
  const { lang } = await params;
  const dict = await getDictionary();

  return {
    title: dict.list.label,
    description: dict.list.description,
    alternates: {
      canonical: `/${lang}/list`,
      languages: {
        en: "/en/list",
        tr: "/tr/list",
        ku: "/ku/list",
      },
    },
  };
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

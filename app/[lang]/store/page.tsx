import type { Metadata } from "next";

import StoreCatalog from "./StoreCatalog";
import { getDictionary, getDictionaryFor } from "../dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/store">): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionaryFor(lang);

  return {
    title: dict.nav.store,
    description: dict.store.body,
    alternates: {
      canonical: `/${lang}/store`,
      languages: { en: "/en/store", tr: "/tr/store" },
    },
  };
}

export default async function StorePage() {
  const dict = await getDictionary();

  return <StoreCatalog dict={dict.store} />;
}

import type { Metadata } from "next";

import Breadcrumbs from "../components/Breadcrumbs";
import StoreCatalog from "./StoreCatalog";

import { getCatalog } from "@/lib/catalog";
import { getDictionary, getLocaleFor } from "../dictionaries";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

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

  const crumbs = [
    { name: dict.nav.home, href: `/${locale}` },
    { name: dict.nav.store, href: `/${locale}/store` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(crumbs)),
        }}
      />

      <Breadcrumbs items={crumbs} label={dict.common.breadcrumb} />

      <StoreCatalog
        products={products}
        locale={locale}
        dict={dict}
      />
    </>
  );
}

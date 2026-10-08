import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumbs from "../../components/Breadcrumbs";
import ProductDetail from "./ProductDetail";

import { getProduct } from "@/lib/catalog";
import type { ProductDetail as Product } from "@/lib/order-types";
import type { Locale } from "@/lib/i18n";
import { categoryLabel } from "@/lib/catalog-taxonomy";
import {
  CURRENCIES,
  effectivePrice,
  isDiscounted,
  selectMoney,
} from "@/lib/price";
import {
  breadcrumbJsonLd,
  buildContentMetadata,
  SITE_NAME,
  SITE_URL,
  type BreadcrumbItem,
} from "@/lib/seo";

import { getDictionary, getLocaleFor } from "../../dictionaries";

/** Products come from the database, so the page is rendered per request. */
export const dynamic = "force-dynamic";

/** Product images are stored as absolute URLs, but a local path still works. */
function absoluteImage(image: string): string {
  return image.startsWith("/") ? `${SITE_URL}${image}` : image;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/store/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = getLocaleFor(lang);
  const product = await getProduct(slug, locale);
  const path = `/store/${slug}`;

  if (!product) {
    return buildContentMetadata({
      locale,
      path,
      fallbackPage: "store",
    });
  }

  return buildContentMetadata({
    locale,
    path,
    title: `${product.name} | ${SITE_NAME}`,
    description: product.description,
    image: absoluteImage(product.image),
    fallbackPage: "store",
  });
}

/**
 * Home > Store > Family > Product. The family step points at the filtered
 * catalog the home page already deep-links into, so the whole trail is made of
 * URLs that already exist.
 */
function productCrumbs(
  product: Product,
  locale: Locale,
  dict: Awaited<ReturnType<typeof getDictionary>>,
): BreadcrumbItem[] {
  const family = dict.store.families[
    product.family as keyof typeof dict.store.families
  ];

  return [
    { name: dict.nav.home, href: `/${locale}` },
    { name: dict.nav.store, href: `/${locale}/store` },
    {
      name: family ?? categoryLabel(product.family),
      href: `/${locale}/store?family=${encodeURIComponent(product.family)}`,
    },
    { name: product.name, href: `/${locale}/store/${product.id}` },
  ];
}

/** Schema.org for the product itself, with an offer per priced currency. */
function productJsonLd(
  product: Product,
  locale: Locale,
  dict: Awaited<ReturnType<typeof getDictionary>>,
): string {
  const offers = CURRENCIES.flatMap((currency) => {
    const money = selectMoney(product, currency);
    const price = isDiscounted(money)
      ? effectivePrice(money)
      : money.price;

    if (price === null) return [];

    return [
      {
        "@type": "Offer",
        price: price.toFixed(2),
        priceCurrency: currency,
        url: `${SITE_URL}/${locale}/store/${product.id}`,
      },
    ];
  });

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: [absoluteImage(product.image)],
        sku: product.id,
        category: product.category,
        brand: { "@type": "Brand", name: SITE_NAME },
        /* A product with no price in any currency has no offer to declare; an
           empty array would be invalid, and stock is not tracked anywhere. */
        ...(offers.length > 0 ? { offers } : {}),
      },
      breadcrumbJsonLd(productCrumbs(product, locale, dict)),
    ],
  });
}

export default async function ProductPage({
  params,
}: PageProps<"/[lang]/store/[slug]">) {
  const { lang, slug } = await params;
  const locale = getLocaleFor(lang);

  const [product, dict] = await Promise.all([
    getProduct(slug, locale),
    getDictionary(),
  ]);

  if (!product) notFound();

  const crumbs = productCrumbs(product, locale, dict);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: productJsonLd(product, locale, dict),
        }}
      />

      <Breadcrumbs items={crumbs} label={dict.common.breadcrumb} />

      <ProductDetail
        product={product}
        locale={locale}
        dict={dict}
      />
    </>
  );
}

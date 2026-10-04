import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetail from "./ProductDetail";

import { getProduct } from "@/lib/catalog";
import type { ProductDetail as Product } from "@/lib/order-types";
import type { Locale } from "@/lib/i18n";
import {
  CURRENCIES,
  effectivePrice,
  isDiscounted,
  selectMoney,
} from "@/lib/price";
import { buildContentMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

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

/** Schema.org for the product itself, with an offer per priced currency. */
function productJsonLd(
  product: Product,
  locale: Locale,
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
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/${locale}/store/${product.id}`,
      },
    ];
  });

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [absoluteImage(product.image)],
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: productJsonLd(product, locale),
        }}
      />

      <ProductDetail
        product={product}
        locale={locale}
        dict={dict}
      />
    </>
  );
}

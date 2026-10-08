import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getDictionaryFor,
  getLocaleFor,
} from "../../dictionaries";
import { buildContentMetadata, getLegalSeo } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import { isLegalSlug, legalPageKey, LEGAL_SLUGS } from "@/lib/legal";
import PageSections from "../../components/PageSections";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isLegalSlug(slug)) return {};

  const locale = getLocaleFor(lang);
  const page = await getPage(legalPageKey(slug), locale);

  /* `subtitle` holds the opening of the document, so it is only usable as a
     description once it has been trimmed; the per-locale legal copy is the
     better fallback when the CMS SEO fields are still empty. */
  const fallback = getLegalSeo(locale, slug);

  return buildContentMetadata({
    locale,
    path: `/legal/${slug}`,
    title: page?.seoTitle || page?.title || fallback.title,
    description: page?.seoDescription || fallback.description,
  });
}

export default async function LegalPage({
  params,
}: PageProps<"/[lang]/legal/[slug]">) {
  const { lang, slug } = await params;

  if (!isLegalSlug(slug)) notFound();

  const locale = getLocaleFor(lang);
  const dict = getDictionaryFor(lang);
  const page = await getPage(legalPageKey(slug), locale);

  if (!page) notFound();

  return (
    <main className="legal-page">
      <PageSections page={page} dict={dict} locale={locale} />
    </main>
  );
}

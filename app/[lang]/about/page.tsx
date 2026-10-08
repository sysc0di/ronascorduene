import type { Metadata } from "next";

import { getDictionary, getLocale, getLocaleFor } from "../dictionaries";
import { buildContentMetadata } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import PageSections from "../components/PageSections";
import "./About.css";

/** Copy is edited in the admin panel, so the page renders per request.
 *  A prerendered build would keep serving whatever text existed when the
 *  site was last deployed. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocaleFor(lang);
  const page = await getPage("about", locale);

  return buildContentMetadata({
    locale,
    path: "/about",
    title: page?.seoTitle || page?.title,
    description: page?.seoDescription || page?.subtitle,
    fallbackPage: "about",
  });
}

export default async function AboutPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const page = await getPage("about", locale);

  if (!page) return null;

  return (
    <main className="about-page">
      <PageSections page={page} dict={dict} locale={locale} />
    </main>
  );
}

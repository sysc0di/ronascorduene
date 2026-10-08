import type { Metadata } from "next";

import { getDictionary, getLocale, getLocaleFor } from "../dictionaries";
import { buildContentMetadata } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import PageSections from "../components/PageSections";
import "./Contact.css";

/** Copy is edited in the admin panel, so the page renders per request.
 *  A prerendered build would keep serving whatever text existed when the
 *  site was last deployed. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocaleFor(lang);
  const page = await getPage("contact", locale);

  return buildContentMetadata({
    locale,
    path: "/contact",
    title: page?.seoTitle || page?.title,
    description: page?.seoDescription || page?.subtitle,
    fallbackPage: "contact",
  });
}

export default async function ContactPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const page = await getPage("contact", locale);

  if (!page) return null;

  return (
    <main className="contact-page">
      <PageSections page={page} dict={dict} locale={locale} />
    </main>
  );
}

import type { Metadata } from "next";

import { getDictionary, getLocale, getLocaleFor } from "../dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import PageSections from "../components/PageSections";
import "./About.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;

  return buildMetadata({ locale: getLocaleFor(lang), page: "about" });
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

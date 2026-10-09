import type { Metadata } from "next";

import { getDictionary, getLocale, getLocaleFor } from "../dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import PageSections from "../components/PageSections";
import Reveal from "../components/Reveal";
import "./Initiative.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/impact">): Promise<Metadata> {
  const { lang } = await params;

  return buildMetadata({ locale: getLocaleFor(lang), page: "initiative" });
}

export default async function ImpactPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const page = await getPage("impact", locale);

  if (!page) return null;

  return (
    <main className="initiative-page">
      <PageSections page={page} dict={dict} locale={locale} />
      <Reveal />
    </main>
  );
}

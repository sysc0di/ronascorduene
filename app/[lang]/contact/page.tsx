import type { Metadata } from "next";

import { getDictionary, getLocale, getLocaleFor } from "../dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import PageSections from "../components/PageSections";
import "./Contact.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;

  return buildMetadata({ locale: getLocaleFor(lang), page: "contact" });
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

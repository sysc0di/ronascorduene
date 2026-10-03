import type { Metadata } from "next";

import { getDictionary, getLocale, getLocaleFor } from "../dictionaries";
import { buildMetadata } from "@/lib/seo";

import InitiativeContent from "./InitiativeContent";
import "./Initiative.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/initiative">): Promise<Metadata> {
  const { lang } = await params;

  return buildMetadata({ locale: getLocaleFor(lang), page: "initiative" });
}

export default async function InitiativePage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return <InitiativeContent dict={dict.initiative} locale={locale} />;
}

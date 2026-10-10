import type { Metadata } from "next";

import { getDictionary, getLocale } from "./dictionaries";

import NotFoundBody from "../components/NotFoundBody";

/**
 * 404 for anything inside a locale: an unknown product, a legal slug outside
 * the list, or a locale that does not exist. Server component, no client JS.
 *
 * Next injects `robots: noindex` for a 404 status, but this boundary renders
 * inside `layout.tsx`, whose metadata also declares `index, follow` and a
 * canonical for the home page. Overriding both here keeps the two directives
 * from contradicting each other and stops a dead URL from canonicalising to `/`.
 */
export const metadata: Metadata = {
  title: "404",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {},
};

export default async function NotFound() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return <NotFoundBody dict={dict} locale={locale} />;
}
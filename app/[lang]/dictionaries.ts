import { lang } from "next/root-params";
import { notFound } from "next/navigation";

import en from "./dictionaries/en.json";
import tr from "./dictionaries/tr.json";

import { hasLocale, type Locale } from "@/lib/i18n";

const dictionaries = {
  en,
  tr,
};

export type Dictionary = (typeof dictionaries)["en"];

export { hasLocale };
export type { Locale };

/** Explicit-locale lookup, for callers that already hold `lang`. */
export function getDictionaryFor(locale: string): Dictionary {
  if (!hasLocale(locale)) {
    notFound();
  }

  return dictionaries[locale];
}

/** Explicit-locale lookup that returns the narrowed locale. */
export function getLocaleFor(locale: string): Locale {
  if (!hasLocale(locale)) {
    notFound();
  }

  return locale;
}

/** Resolves the locale from the `[lang]` route segment. */
export async function getDictionary(): Promise<Dictionary> {
  return getDictionaryFor(await lang());
}

export async function getLocale(): Promise<Locale> {
  return getLocaleFor(await lang());
}

export const locales = ["en", "tr", "ku"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  tr: "TR",
  ku: "KU",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  ku: "Kurmancî",
};

export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  tr: "tr_TR",
  ku: "ku_TR",
};

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Cookie wins, then the browser's Accept-Language, then the default. */
export function negotiateLocale(
  acceptLanguage: string | null,
  cookieLocale?: string,
): Locale {
  if (cookieLocale && hasLocale(cookieLocale)) {
    return cookieLocale;
  }

  if (acceptLanguage) {
    const ranked = acceptLanguage
      .split(",")
      .map((part) => {
        const [tag, ...params] = part.trim().split(";");

        const q = params
          .map((param) => param.trim())
          .find((param) => param.startsWith("q="));

        return {
          tag: (tag ?? "").trim().toLowerCase(),
          quality: q ? Number.parseFloat(q.slice(2)) : 1,
        };
      })
      .filter((entry) => entry.tag.length > 0)
      .sort((a, b) => b.quality - a.quality);

    for (const { tag } of ranked) {
      const base = tag.split("-")[0];

      if (hasLocale(base)) {
        return base;
      }
    }
  }

  return defaultLocale;
}

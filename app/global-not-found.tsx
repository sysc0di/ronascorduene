import type { Metadata } from "next";
import { Geist, Geist_Mono, Mr_Dafoe } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import { Navbar } from "./components/navbar";
import Footer from "./components/Footer";
import NotFoundBody from "./components/NotFoundBody";
import MobileContactBar from "./[lang]/components/MobileContactBar";

import { defaultLocale, hasLocale, isRtl, type Locale } from "@/lib/i18n";
import { getDictionaryFor } from "./[lang]/dictionaries";

/*
 * The root layout sits inside the `[lang]` dynamic segment, so a URL that
 * matches no locale (e.g. a removed page) never reaches that layout, and its
 * `not-found.tsx` cannot compose the site chrome for it. `global-not-found`
 * runs at the routing level and bypasses the layout entirely, so everything
 * the layout normally provides — fonts, global CSS, navbar, footer — has to be
 * assembled here to keep the 404 looking like the rest of the site.
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mrDafoe = Mr_Dafoe({
  weight: "400",
  variable: "--font-mr-dafoe",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "404",
  robots: {
    index: false,
    follow: true,
  },
};

/** `proxy.ts` forwards the locale it matched so the 404 keeps language + dir. */
async function resolveLocale(): Promise<Locale> {
  const requested = (await headers()).get("x-locale");

  return requested && hasLocale(requested) ? requested : defaultLocale;
}

export default async function GlobalNotFound() {
  const locale = await resolveLocale();
  const dict = getDictionaryFor(locale);

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${mrDafoe.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar locale={locale} dict={dict} />
        <main>
          <NotFoundBody dict={dict} locale={locale} />
        </main>
        <Footer locale={locale} dict={dict} />
        <MobileContactBar locale={locale} dict={dict} />
      </body>
    </html>
  );
}

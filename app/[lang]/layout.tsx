import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../globals.css";

import { Navbar } from "../components/navbar";
import Footer from "../components/Footer";

import { getDictionary, getLocale } from "./dictionaries";
import { defaultLocale, hasLocale, locales, ogLocales } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary();

  return {
    title: {
      default: dict.meta.title,
      template: `%s | Ronas Corduene`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `/${locale}`]),
      ),
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: ogLocales[hasLocale(lang) ? lang : defaultLocale],
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[lang]">) {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar locale={locale} dict={dict} />
        <main>{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}

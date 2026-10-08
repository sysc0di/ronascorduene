import type { Metadata } from "next";
import { Geist, Geist_Mono, Mr_Dafoe } from "next/font/google";

import "../globals.css";

import { Navbar } from "../components/navbar";
import Footer from "../components/Footer";
import MobileContactBar from "./components/MobileContactBar";

import { getDictionary, getLocale } from "./dictionaries";
import { defaultLocale, hasLocale, isRtl, locales } from "@/lib/i18n";
import { buildMetadata, SEO, SITE_NAME, structuredData } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* The hero wordmark is set in Mr Dafoe. Nothing loaded it before, so the
   "signature" rendered in whatever cursive face the OS happened to offer. */
const mrDafoe = Mr_Dafoe({
  weight: "400",
  variable: "--font-mr-dafoe",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : defaultLocale;

  return {
    ...buildMetadata({ locale, page: "home" }),
    title: {
      default: SEO[locale].pages.home.title,
      template: `%s | ${SITE_NAME}`,
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
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${mrDafoe.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData(locale)),
          }}
        />
        <Navbar locale={locale} dict={dict} />
        <main>{children}</main>
        <Footer locale={locale} dict={dict} />
        <MobileContactBar locale={locale} dict={dict} />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import grtgt from "@/public/assets/homebannerimg.jpg";
import RonasSignature from "../components/RonasSignature";
import RonasSubtitle from "../components/RonasSubtitle";
import ScrollIndicator from "../components/ScrollIndicator";
import ProductSections from "../components/ProductSections";
import ApproachSection from "../components/ApproachSection";
import { getDictionary, getLocale, getLocaleFor } from "./dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getPage } from "@/lib/pages";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;

  return buildMetadata({ locale: getLocaleFor(lang), page: "home" });
}

/** Copy is edited in the admin panel, so the page renders per request.
 *  A prerendered build would keep serving whatever text existed when the
 *  site was last deployed. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const page = await getPage("home", locale);

  const hero = page?.sections.find((section) => section.type === "home-hero");
  const approach = page?.sections.find(
    (section) => section.type === "home-approach",
  );

  return (
    <main className="home">
      <section id="hero" className="hero relative overflow-hidden">
        <Image
          src={hero?.image || grtgt}
          alt={dict.home.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0" />

        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="page-title w-full max-w-6xl md:p-12">
            <RonasSignature />
            <RonasSubtitle text={hero?.body || dict.home.subtitle} />
          </div>
        </div>

        <ScrollIndicator label={dict.home.scrollDown} />
      </section>

      <div className="productonhome">
        <ProductSections dict={dict.home.products} locale={locale} />
        <ApproachSection
          dict={dict.home.approach}
          content={
            approach
              ? {
                  image: approach.image,
                  title: approach.title,
                  description: approach.body,
                  href: approach.href,
                }
              : null
          }
        />
      </div>
    </main>
  );
}

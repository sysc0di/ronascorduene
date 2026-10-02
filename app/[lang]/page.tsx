import Image from "next/image";
import grtgt from "@/public/assets/homebanner.jpg";
import RonasTitle from "../components/RonasTitle";
import RonasSubtitle from "../components/RonasSubtitle";
import ScrollIndicator from "../components/ScrollIndicator";
import ProductSections from "../components/ProductSections";
import ApproachSection from "../components/ApproachSection";
import { getDictionary, getLocale } from "./dictionaries";
import { APPROACH_SECTION_KEY, getSiteSection } from "@/lib/content";

export default async function Home() {
  const dict = await getDictionary();
  const locale = await getLocale();
  const approach = await getSiteSection(APPROACH_SECTION_KEY, locale);

  return (
    <main className="home">
      <section
        id="hero"
        className="hero relative overflow-hidden"
      >
        <Image
          src={grtgt}
          alt={dict.home.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0" />

        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="page-title w-full max-w-6xl md:p-12">
            <RonasTitle titleLines={dict.home.titleLines} />
            <RonasSubtitle text={dict.home.subtitle} />
          </div>
        </div>

        <ScrollIndicator label={dict.home.scrollDown} />
      </section>

      <div className="productonhome">
        <ProductSections dict={dict.home.products} />
        <ApproachSection dict={dict.home.approach} content={approach} />
      </div>
    </main>
  );
}

import Image from "next/image";
import grtgt from "../public/assets/homebanner.jpg";
import RonasTitle from "./components/RonasTitle";
import RonasSubtitle from "./components/RonasSubtitle";
import ScrollIndicator from "./components/ScrollIndicator";
import ProductSections from "./components/ProductSections";
import ApproachSection from "./components/ApproachSection";

export default function Home() {
  return (
    <main className="home">
      <section
        id="hero"
        className="hero relative overflow-hidden"
      >
        <Image
          src={grtgt}
          alt="Toyota GR GT"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0" />

        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="page-title w-full max-w-6xl md:p-12">
            <RonasTitle />
            <RonasSubtitle />
          </div>
        </div>

        <ScrollIndicator />
      </section>

      <div className="productonhome">
        <ProductSections />
        <ApproachSection/>
      </div>
    </main>
  );
}

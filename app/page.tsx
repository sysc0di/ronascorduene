import Image from "next/image";
import grtgt from "../public/assets/toyota-gr-gt.webp";
import RonasTitle from "./components/RonasTitle";
import RonasSubtitle from "./components/RonasSubtitle";
import ScrollIndicator from "./components/ScrollIndicator";
import ProductSections from "./components/ProductSections";

export default function Home() {
  return (
    <main className="home" >
      <section className="relative h-[calc(100dvh-var(--navbar-h))] overflow-hidden">
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
          <div className="page-title max-w-4xl w-full pt-12 pb-8 md:py-16">
            <RonasTitle />
            <RonasSubtitle />
          </div >
          <ScrollIndicator />
        </div >
      </section>
        <div className="productonhome" >
          <ProductSections/>
        </div>
    </main>
  );
}

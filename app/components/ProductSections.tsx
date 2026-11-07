import type { Dictionary } from "../[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";

import { prisma } from "@/lib/prisma";
import ProductStrip, { type HomeSlide } from "./ProductStrip";

import "./ProductSections.css";

type ProductsDict = Dictionary["home"]["products"];

/*
 * Fallback used when the database has no home slides (e.g. before seeding or
 * in a fresh environment). Mirrors the bundled public assets.
 */
const FALLBACK_SLIDES: HomeSlide[] = [
  { image: "/assets/ewrba-kart.png", slug: "ewrba", alt: "Ewrba", name: "EWRBA" },
  { image: "/assets/vazzasta-card.png", slug: "vazzasta", alt: "Vazzasta", name: "VAZZASTA" },
  { image: "/assets/carvasha-kart2.png", slug: "carvasha", alt: "Carvasha", name: "CARVASHA" },
  {
    image: "/assets/fan-collection-kart-final.png",
    slug: "fancollection",
    alt: "Fan collection",
    name: "FAN COLLECTION",
  },
];

export default async function ProductSections({
  dict,
  locale,
  buttonLabel,
}: {
  dict: ProductsDict;
  locale: Locale;
  buttonLabel?: string;
}) {
  let slides: HomeSlide[] = [];

  try {
    const [rows, collections] = await Promise.all([
      prisma.homeSlide.findMany({
        where: { visible: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      prisma.collection.findMany({
        where: { visible: true },
        select: { slug: true, name: true },
      }),
    ]);

    const nameBySlug = new Map(collections.map((c) => [c.slug, c.name]));

    if (rows.length > 0) {
      slides = rows.map((row) => ({
        id: row.id,
        image: row.image,
        slug: row.collectionSlug,
        alt: row.collectionSlug,
        name: nameBySlug.get(row.collectionSlug) ?? row.collectionSlug,
      }));
    }
  } catch {
    // DB unavailable: fall through to the bundled assets.
  }

  if (slides.length === 0) slides = FALLBACK_SLIDES;

  return (
    <section className="products">
      <div className="products-header">
        <span>{dict.brand}</span>
        <span>{dict.label}</span>
      </div>

      <ProductStrip
        slides={slides}
        locale={locale}
        buttonLabel={buttonLabel}
      />
    </section>
  );
}

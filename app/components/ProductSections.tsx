"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Dictionary } from "../[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";

import "./ProductSections.css";

type ProductsDict = Dictionary["home"]["products"];

/*
 * The card images already carry their own lettering, so no caption is
 * rendered on top. Each slide links to its collection on the store page.
 */
const SLIDES: { image: string; slug: string; alt: string }[] = [
  { image: "/assets/carvasha-kart2.png", slug: "carvasha", alt: "Carvasha" },
  { image: "/assets/ewrba-kart.png", slug: "ewrba", alt: "Ewrba" },
  { image: "/assets/vazzasta-card.png", slug: "vazzasta", alt: "Vazzasta" },
  {
    image: "/assets/fan-collection-kart-final.png",
    slug: "fancollection",
    alt: "Fan collection",
  },
];

export default function ProductSections({
  dict,
  locale,
}: {
  dict: ProductsDict;
  locale: Locale;
}) {
  return (
    <section className="products">
      <div className="products-header">
        <span>{dict.brand}</span>
        <span>{dict.label}</span>
      </div>

      <ProductSlideshow locale={locale} brand={dict.brand} />
    </section>
  );
}

function ProductSlideshow({
  locale,
  brand,
}: {
  locale: Locale;
  brand?: string;
}) {
  const count = SLIDES.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced || paused || count <= 1) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, 5000);
    return () => window.clearInterval(id);
  }, [reduced, paused, count]);

  const go = useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => go(active + 1), [active, go]);
  const prev = useCallback(() => go(active - 1), [active, go]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      }
    };
    element.addEventListener("keydown", onKey);
    return () => element.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const delta = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next();
      else prev();
    }
  };

  return (
    <div
      ref={containerRef}
      className="product-slideshow"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={brand ?? "Products"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="product-slideshow-track">
        {SLIDES.map((slide, index) => {
          const isActive = index === active;
          return (
            <div
              key={slide.slug}
              className={`product-slide ${isActive ? "is-active" : ""}`}
              aria-hidden={!isActive}
            >
              <Link
                href={`/${locale}/store?collection=${slide.slug}`}
                className="product-slide-link"
                tabIndex={isActive ? 0 : -1}
              >
                <div className="product-slide-image">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 600px) 100vw, 80vw"
                    priority={index === 0}
                  />
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="product-slideshow-nav" aria-hidden="true">
        <button type="button" onClick={prev} aria-label="Previous slide">
          ‹
        </button>
        <button type="button" onClick={next} aria-label="Next slide">
          ›
        </button>
      </div>

      <div className="product-slideshow-dots" role="tablist">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.slug}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Slide ${index + 1}: ${slide.alt}`}
            className={`product-slideshow-dot ${
              index === active ? "is-active" : ""
            }`}
            onClick={() => go(index)}
          />
        ))}
      </div>

      <span className="sr-only" aria-live="polite">
        {SLIDES[active]?.alt}
      </span>
    </div>
  );
}

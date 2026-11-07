"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n";

export type HomeSlide = {
  id?: string;
  image: string;
  slug: string;
  alt?: string;
  name?: string;
};

export default function ProductStrip({
  slides,
  locale,
  buttonLabel,
}: {
  slides: HomeSlide[];
  locale: Locale;
  buttonLabel?: string;
}) {
  const count = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setActive(index);
  }, []);

  useEffect(() => {
    if (reduced || paused || count <= 1) return;
    const id = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % count;
        const card = cardRefs.current[next];
        const track = trackRef.current;
        if (track && card) {
          track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, 4000);
    return () => window.clearInterval(id);
  }, [reduced, paused, count]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sl = track.scrollLeft;
        let best = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const d = Math.abs(card.offsetLeft - sl);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (count === 0) return null;

  return (
    <div
      className="product-strip"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div ref={trackRef} className="product-strip-track">
        {slides.map((card, index) => (
          <div
            key={card.id ?? card.slug}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="product-strip-card"
          >
            <div className="product-strip-image">
              <Image
                src={card.image}
                alt={card.alt ?? card.slug}
                fill
                sizes="(max-width: 900px) 82vw, 100vw"
              />
            </div>
            <div className="product-strip-body">
              <h3 className="product-strip-title">
                {card.name ?? card.alt ?? card.slug}
              </h3>
              <Link
                href={`/${locale}/store?collection=${card.slug}`}
                className="product-strip-button"
              >
                {buttonLabel ?? "Store"}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="product-strip-dots" role="tablist">
        {slides.map((card, index) => (
          <button
            key={card.id ?? card.slug}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Slide ${index + 1}: ${card.alt ?? card.slug}`}
            className={`product-strip-dot ${
              index === active ? "is-active" : ""
            }`}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

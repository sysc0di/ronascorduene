"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CATEGORY_SLUGS } from "@/lib/catalog-taxonomy";

import type { Dictionary } from "../[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";

import "./ProductSections.css";

type ProductsDict = Dictionary["home"]["products"];

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

      <div className="products-list">
        {dict.items.map((product, index) => (
          <ProductItem
            key={product.title}
            product={product}
            number={(index + 1).toString().padStart(2, "0")}
            meta={dict.meta}
            index={index}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}

function ProductItem({
  product,
  number,
  meta,
  index,
  locale,
}: {
  product: ProductsDict["items"][number];
  number: string;
  meta: string;
  index: number;
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /*
   * The three home blocks line up with the store's product families, so each
   * title deep-links into that family rather than the unfiltered catalog.
   */
  const family = CATEGORY_SLUGS[index];
  const href = family
    ? `/${locale}/store?family=${family}`
    : `/${locale}/store`;

  /*
   * 0 = LEFT
   * 1 = RIGHT
   * 2 = LEFT
   * 3 = RIGHT
   */
  const isRight = index % 2 !== 0;

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-hover-target
      className={`
        product-item
        ${visible ? "product-visible" : ""}
        ${isRight ? "product-right" : "product-left"}
      `}
    >
      <div className="product-top">
        <div className="product-meta">
          <span>{number}</span>
          <span>{meta}</span>
        </div>

        <div className="product-line">
          <span />
        </div>
      </div>

      <div className="product-content">
        <div className="product-title">
          <h2>
            <Link href={href} data-hover-target>
              {product.title}
            </Link>
          </h2>

          <p>{product.subtitle}</p>
        </div>
      </div>
    </div>
  );
}


"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Dictionary } from "../[lang]/dictionaries";

import "./ProductSections.css";

type ProductsDict = Dictionary["home"]["products"];

const images = [
  "/assets/wheel.jpg",
  "/assets/exterior.jpg",
  "/assets/performance.jpg",
];

export default function ProductSections({
  dict,
}: {
  dict: ProductsDict;
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
}: {
  product: ProductsDict["items"][number];
  number: string;
  meta: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const isRight = index % 2 === 0;

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
          <h2>{product.title}</h2>

          <p>{product.subtitle}</p>
        </div>


      </div>
    </div>
  );
}

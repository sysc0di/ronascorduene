
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
  const [active, setActive] = useState<number | null>(null);

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
            image={images[index]}
            number={(index + 1).toString().padStart(2, "0")}
            meta={dict.meta}
            index={index}
            active={active}
            setActive={setActive}
          />
        ))}
      </div>

    </section>
  );
}

function ProductItem({
  product,
  image,
  number,
  meta,
  index,
  active,
  setActive,
}: {
  product: ProductsDict["items"][number];
  image: string | undefined;
  number: string;
  meta: string;
  index: number;
  active: number | null;
  setActive: (index: number | null) => void;
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
      className={`
        product-item
        ${visible ? "product-visible" : ""}
        ${active === index ? "product-active" : ""}
        ${isRight ? "product-right" : "product-left"}
      `}
      onMouseEnter={() => setActive(index)}
      onMouseLeave={() => setActive(null)}
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

        {image && (
          <div className="product-preview">
            <Image
              src={image}
              alt={product.title}
              fill
              sizes="(max-width: 600px) 60vw, (max-width: 1200px) 32vw, 440px"
              className="preview-image"
            />
          </div>
        )}

      </div>
    </div>
  );
}


"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./ProductSections.css";

const products = [
  {
    number: "01",
    title: "WHEELS",
    subtitle: "Forged for the road.",
    image: "/assets/wheel.jpg",
  },
  {
    number: "02",
    title: "EXTERIOR",
    subtitle: "Built to stand apart.",
    image: "/assets/exterior.jpg",
  },
  {
    number: "03",
    title: "PERFORMANCE",
    subtitle: "Made to move.",
    image: "/assets/performance.jpg",
  },
];

export default function ProductSections() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="products">

      <div className="products-header">
        <span>RONAS</span>
        <span>AUTOMOTIVE EQUIPMENT</span>
      </div>

      <div className="products-list">
        {products.map((product, index) => (
          <ProductItem
            key={product.number}
            product={product}
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
  index,
  active,
  setActive,
}: {
  product: (typeof products)[number];
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
          <span>{product.number}</span>
          <span>RONAS / EQUIPMENT</span>
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

        <div className="product-preview">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 600px) 60vw, (max-width: 1200px) 32vw, 440px"
            className="preview-image"
          />
        </div>

      </div>
    </div>
  );
}

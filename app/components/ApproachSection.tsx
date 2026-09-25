"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./ApproachSection.css";

export default function ApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`approach ${visible ? "approach-visible" : ""}`}
    >
      <div className="approach-image">
        <Image
          src="/assets/approach.jpg"
          alt="Ronas automotive equipment"
          fill
          sizes="100vw"
          className="approach-image-content"
        />

        <div className="approach-overlay" />
      </div>

      <div className="approach-content">
        <div className="approach-top">
          <span>04</span>
          <span>RONAS / APPROACH</span>
        </div>

        <div className="approach-line" />

        <div className="approach-main">
          <div className="approach-label">
            ENGINEERED FOR THE DRIVE
          </div>

          <h2>
            BUILT
            <br />
            WITH
            <br />
            PURPOSE.
          </h2>

          <p>
            Every component is designed around the same idea:
            precise engineering, purposeful form, and a character
            that belongs on the road.
          </p>
        </div>

        <div className="approach-values">
          <div>
            <span>01</span>
            <strong>PRECISION</strong>
          </div>

          <div>
            <span>02</span>
            <strong>FUNCTION</strong>
          </div>

          <div>
            <span>03</span>
            <strong>CHARACTER</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

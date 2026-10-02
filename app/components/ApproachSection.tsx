"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

import type { Dictionary } from "../[lang]/dictionaries";

import "./ApproachSection.css";

type ApproachDict = Dictionary["home"]["approach"];

type ApproachContent = {
  image: string;
  title: string;
  description: string;
};

const DEFAULT_IMAGE = "/assets/739d6f87-00fc-4c94-aa88-213a021c47a8.jpg";

export default function ApproachSection({
  dict,
  content,
}: {
  dict: ApproachDict;
  content?: ApproachContent | null;
}) {
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

  /* Admin-managed content wins; the dictionary stays as a safe fallback. */
  const image = content?.image.trim() || DEFAULT_IMAGE;
  const body = content?.description.trim() || dict.body;
  const titleLines = (content?.title.trim() || dict.titleLines.join("\n"))
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <section
      ref={sectionRef}
      data-hover-target
      className={`approach ${visible ? "approach-visible" : ""}`}
    >
      <div className="approach-image">
        <Image
          src={image}
          alt={dict.alt}
          fill
          sizes="100vw"
          className="approach-image-content"
        />

        <div className="approach-overlay" />
      </div>

      <div className="approach-content">
        <div className="approach-top">
          <span>04</span>
          <span>{dict.meta}</span>
        </div>

        <div className="approach-line" />

        <div className="approach-main">
          <div className="approach-label">
            {dict.label}
          </div>

          <h2>
            {titleLines.map((line, index) => (
              <Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h2>

          <p>{body}</p>
        </div>

        <div className="approach-values">
          {dict.values.map((value, index) => (
            <div key={value}>
              <span>{(index + 1).toString().padStart(2, "0")}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

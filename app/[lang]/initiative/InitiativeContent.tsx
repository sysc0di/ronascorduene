"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, type CSSProperties } from "react";

import type { Dictionary } from "../dictionaries";
import type { Locale } from "@/lib/i18n";

type InitiativeDict = Dictionary["initiative"];

const BAND_IMAGE = "/assets/exhaustmanifolds.jpg";

const delay = (index: number) =>
  ({ "--reveal-delay": `${index * 80}ms` }) as CSSProperties;

export default function InitiativeContent({
  dict,
  locale,
}: {
  dict: InitiativeDict;
  locale: Locale;
}) {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (targets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    for (const target of targets) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

  const title = (lines: string[]) => (
    <h2 data-reveal>
      {lines.map((line, index) => (
        <Fragment key={line}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </h2>
  );

  return (
    <main className="initiative-page">
      <section className="initiative-hero">
        <div className="initiative-hero-meta" data-reveal>
          <span>05</span>
          <span>{dict.meta}</span>
        </div>

        <div className="initiative-hero-content">
          <span className="initiative-eyebrow" data-reveal>
            {dict.hero.label}
          </span>

          <h1 data-reveal>
            {dict.hero.titleLines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>

          <p data-reveal>{dict.hero.body}</p>
        </div>
      </section>

      <section className="initiative-band">
        <div className="initiative-band-media" data-hover-target data-reveal>
          <Image
            src={BAND_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="initiative-band-image"
          />
          <div className="initiative-band-overlay" aria-hidden="true" />
          <div className="initiative-band-caption" aria-hidden="true">
            <span>{dict.examples.caption[0]}</span>
            <span>{dict.examples.caption[1]}</span>
          </div>
        </div>
      </section>

      <section className="initiative-why">
        <div className="initiative-section-header" data-reveal>
          <span>01</span>
          <span>{dict.why.header}</span>
        </div>

        <div className="initiative-why-grid">
          {title(dict.why.titleLines)}
          <div className="initiative-why-text">
            {dict.why.paragraphs.map((paragraph) => (
              <p key={paragraph} data-reveal>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="initiative-values">
          {dict.why.values.map((value, index) => (
            <article
              key={value.title}
              className="initiative-value"
              data-reveal
              style={delay(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="initiative-process">
        <div className="initiative-section-header" data-reveal>
          <span>02</span>
          <span>{dict.process.header}</span>
        </div>

        <div className="initiative-process-head">
          {title(dict.process.titleLines)}
          <p data-reveal>{dict.process.intro}</p>
        </div>

        <div className="initiative-flow" data-reveal>
          {dict.process.flow.map((stage, index) => (
            <Fragment key={stage}>
              {index > 0 && (
                <span className="initiative-flow-arrow" aria-hidden="true">
                  &rarr;
                </span>
              )}
              <span className="initiative-flow-stage">{stage}</span>
            </Fragment>
          ))}
        </div>

        <div className="initiative-steps">
          {dict.process.steps.map((step, index) => (
            <article
              key={step.title}
              className="initiative-step"
              data-reveal
              style={delay(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="initiative-examples">
        <div className="initiative-section-header" data-reveal>
          <span>03</span>
          <span>{dict.examples.header}</span>
        </div>

        <div className="initiative-examples-head">
          {title(dict.examples.titleLines)}
          <p data-reveal>{dict.examples.intro}</p>
        </div>

        <div className="initiative-cards">
          {dict.examples.items.map((item, index) => (
            <article
              key={item.title}
              className="initiative-card"
              data-reveal
              style={delay(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="initiative-cta">
        <div className="initiative-section-header" data-reveal>
          <span>04</span>
          <span>{dict.cta.header}</span>
        </div>

        <div className="initiative-cta-content">
          {title(dict.cta.titleLines)}
          <div className="initiative-cta-side">
            <p data-reveal>{dict.cta.body}</p>
            <Link
              href={`/${locale}/contact`}
              className="initiative-cta-button"
              data-hover-target
              data-reveal
            >
              <span>{dict.cta.button}</span>
              <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
        </div>

        <div className="initiative-cta-line" />

        <div className="initiative-cta-bottom">
          <span>{dict.cta.note[0]}</span>
          <span>{dict.cta.note[1]}</span>
        </div>
      </section>
    </main>
  );
}

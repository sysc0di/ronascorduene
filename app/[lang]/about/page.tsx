import type { Metadata } from "next";
import Image from "next/image";

import { getDictionary, getDictionaryFor } from "../dictionaries";
import "./About.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionaryFor(lang);

  return {
    title: dict.nav.about,
    description: dict.about.hero.body,
    alternates: {
      canonical: `/${lang}/about`,
      languages: { en: "/en/about", tr: "/tr/about" },
    },
  };
}

export default async function AboutPage() {
  const dict = await getDictionary();
  const { about } = dict;

  return (
    <main className="about-page">

      {/* HERO */}

      <section className="about-hero">
        <div className="about-hero-meta">
          <span>01</span>
          <span>{about.meta.hero}</span>
        </div>

        <div className="about-hero-line" />

        <div className="about-hero-content">
          <span className="about-label">
            {about.hero.label}
          </span>

          <h1>
            {about.hero.titleLines[0]}
            <br />
            {about.hero.titleLines[1]}
            <br />
            {about.hero.titleLines[2]}
          </h1>

          <p>{about.hero.body}</p>
        </div>
      </section>


      {/* STORY */}

      <section className="about-story">

        <div className="about-section-header">
          <span>02</span>
          <span>{about.meta.idea}</span>
        </div>

        <div className="about-story-grid">

          <div className="about-story-number">
            01
          </div>

          <div className="about-story-content">
            <h2>
              {about.story.titleLines[0]}
              <br />
              {about.story.titleLines[1]}
              <br />
              {about.story.titleLines[2]}
            </h2>

            <div className="about-story-text">
              {about.story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* VALUES */}

      <section className="about-values">

        <div className="about-section-header">
          <span>03</span>
          <span>{about.meta.values}</span>
        </div>

        <div className="about-values-grid">

          {about.values.map((value, index) => (
            <article className="about-value" key={value.title}>
              <span>{(index + 1).toString().padStart(2, "0")}</span>

              <h3>{value.title}</h3>

              <p>{value.body}</p>
            </article>
          ))}

        </div>
      </section>


      {/* IMAGE */}

      <section className="about-image-section">

        <div className="about-image" data-hover-target>
          <Image
            src="/assets/approach.jpg"
            alt={about.image.alt}
            fill
            sizes="100vw"
            className="about-image-content"
          />

          <div className="about-image-overlay" />

          <div className="about-image-caption">
            <span>{about.image.brand}</span>
            <span>{about.image.caption}</span>
          </div>
        </div>

      </section>


      {/* CLOSING */}

      <section className="about-closing">

        <div className="about-section-header">
          <span>04</span>
          <span>{about.meta.approach}</span>
        </div>

        <div className="about-closing-content">

          <h2>
            {about.closing.titleLines[0]}
            <br />
            {about.closing.titleLines[1]}
            <br />
            {about.closing.titleLines[2]}
          </h2>

          <p>{about.closing.body}</p>

        </div>

        <div className="about-closing-line" />

        <div className="about-closing-bottom">
          <span>{about.closing.brand}</span>
          <span>{about.closing.established}</span>
          <span>{dict.common.automotiveEquipment}</span>
        </div>

      </section>

    </main>
  );
}

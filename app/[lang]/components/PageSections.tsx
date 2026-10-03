import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import type { Dictionary } from "../dictionaries";
import type { Locale } from "@/lib/i18n";
import type { ResolvedPage, ResolvedSection } from "@/lib/pages";

import "./Cms.css";

type Ctx = { dict: Dictionary; locale: Locale };

/* ------------------------------------------------------------------ */
/* Text helpers                                                       */
/* ------------------------------------------------------------------ */

function headingLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function paragraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

const pad = (value: number) => String(value).padStart(2, "0");

function Heading({ text }: { text: string }) {
  const lines = headingLines(text);

  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={`${line}-${index}`}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

/** Renders the lightweight markdown used by legal/generic body fields. */
function RichBody({ text }: { text: string }) {
  const blocks = paragraphs(text);

  return (
    <>
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return <h2 key={index}>{block.slice(3).trim()}</h2>;
        }

        const lines = block.split("\n").map((line) => line.trim());

        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index}>
              {lines.map((line, itemIndex) => (
                <li key={itemIndex}>{line.slice(2).trim()}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{block}</p>;
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Page-specific renderers (preserve the original markup + CSS)       */
/* ------------------------------------------------------------------ */

function SectionHeader({
  index,
  label,
  className = "cms-section-header",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span>{index}</span>
      <span>{label}</span>
    </div>
  );
}

function renderHomeHero(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="home-hero-cms" data-section={section.key}>
      {section.image && (
        <Image
          src={section.image}
          alt={ctx.dict.home.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
    </section>
  );
}

function renderHomeApproach(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="home-approach-cms" data-section={section.key}>
      {section.image && (
        <Image
          src={section.image}
          alt={ctx.dict.home.approach.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
    </section>
  );
}

function renderAboutHero(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="about-hero">
      <div className="about-hero-meta">
        <span>01</span>
        <span>{ctx.dict.about.meta.hero}</span>
      </div>

      <div className="about-hero-line" />

      <div className="about-hero-content">
        <span className="about-label">{section.eyebrow}</span>

        <h1>
          <Heading text={section.title} />
        </h1>

        <p>{section.body}</p>
      </div>
    </section>
  );
}

function renderAboutStory(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="about-story">
      <SectionHeader
        index="02"
        label={ctx.dict.about.meta.idea}
        className="about-section-header"
      />

      <div className="about-story-grid">
        <div className="about-story-number">01</div>

        <div className="about-story-content">
          <h2>
            <Heading text={section.title} />
          </h2>

          <div className="about-story-text">
            {paragraphs(section.body).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function renderAboutValues(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="about-values">
      <SectionHeader
        index="03"
        label={ctx.dict.about.meta.values}
        className="about-section-header"
      />

      <div className="about-values-grid">
        {section.items.map((value, index) => (
          <article className="about-value" key={index}>
            <span>{pad(index + 1)}</span>
            <h3>{value.title}</h3>
            <p>{value.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderAboutImage(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="about-image-section">
      <div className="about-image" data-hover-target>
        {section.image && (
          <Image
            src={section.image}
            alt={ctx.dict.about.image.alt}
            fill
            sizes="100vw"
            className="about-image-content"
          />
        )}

        <div className="about-image-overlay" />

        <div className="about-image-caption">
          <span>{section.title}</span>
          <span>{section.body}</span>
        </div>
      </div>
    </section>
  );
}

function renderAboutClosing(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="about-closing">
      <SectionHeader
        index="04"
        label={ctx.dict.about.meta.approach}
        className="about-section-header"
      />

      <div className="about-closing-content">
        <h2>
          <Heading text={section.title} />
        </h2>

        <p>{section.body}</p>
      </div>

      <div className="about-closing-line" />

      <div className="about-closing-bottom">
        <span>{section.eyebrow}</span>
        <span>{section.ctaLabel}</span>
        <span>{ctx.dict.common.automotiveEquipment}</span>
      </div>
    </section>
  );
}

function renderContactHero(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="contact-hero">
      <div className="contact-hero-meta">
        <span>02</span>
        <span>{ctx.dict.contact.meta.hero}</span>
      </div>

      <div className="contact-hero-line" />

      <div className="contact-hero-content">
        <div className="contact-label">{section.eyebrow}</div>

        <h1>
          <Heading text={section.title} />
        </h1>

        <p>{section.body}</p>
      </div>
    </section>
  );
}

function renderContactInfo(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="contact-info">
      <SectionHeader
        index="01"
        label={ctx.dict.contact.meta.info}
        className="contact-section-header"
      />

      <div className="contact-info-grid">
        {section.items.map((item, index) => {
          const body = (
            <>
              <span className="contact-info-number">{pad(index + 1)}</span>

              <div>
                <span className="contact-info-label">{item.title}</span>
                <strong>{item.body}</strong>
              </div>

              {item.href && <span className="contact-arrow">&#8599;</span>}
            </>
          );

          return item.href ? (
            <a
              key={index}
              href={item.href}
              className="contact-info-item"
              data-hover-target
            >
              {body}
            </a>
          ) : (
            <div key={index} className="contact-info-item" data-hover-target>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function renderContactForm(section: ResolvedSection, ctx: Ctx): ReactNode {
  const { form } = ctx.dict.contact;

  return (
    <section className="contact-form-section" data-section={section.key}>
      <SectionHeader
        index="02"
        label={ctx.dict.contact.meta.form}
        className="contact-section-header"
      />

      <form className="contact-form">
        <div className="contact-form-row">
          <label>
            <span>{form.name}</span>
            <input type="text" name="name" placeholder={form.namePlaceholder} />
          </label>

          <label>
            <span>{form.email}</span>
            <input type="email" name="email" placeholder={form.emailPlaceholder} />
          </label>
        </div>

        <label>
          <span>{form.subject}</span>
          <input
            type="text"
            name="subject"
            placeholder={form.subjectPlaceholder}
          />
        </label>

        <label>
          <span>{form.message}</span>
          <textarea
            name="message"
            rows={6}
            placeholder={form.messagePlaceholder}
          />
        </label>

        <button type="submit" className="contact-submit" data-hover-target>
          <span>{form.submit}</span>
          <span>&#8599;</span>
        </button>
      </form>
    </section>
  );
}

function renderContactClosing(section: ResolvedSection): ReactNode {
  return (
    <section className="contact-bottom">
      <div className="contact-bottom-line" />

      <div className="contact-bottom-content">
        <span>{section.eyebrow}</span>

        <strong>
          <Heading text={section.title} />
        </strong>

        <span>{section.ctaLabel}</span>
      </div>
    </section>
  );
}

function renderImpactHero(section: ResolvedSection, ctx: Ctx): ReactNode {
  return (
    <section className="initiative-hero">
      <div className="initiative-hero-meta" data-reveal>
        <span>05</span>
        <span>{ctx.dict.initiative.meta}</span>
      </div>

      <div className="initiative-hero-content">
        <span className="initiative-eyebrow" data-reveal>
          {section.eyebrow}
        </span>

        <h1 data-reveal>
          <Heading text={section.title} />
        </h1>

        <p data-reveal>{section.body}</p>
      </div>
    </section>
  );
}

function renderImpactBand(section: ResolvedSection): ReactNode {
  return (
    <section className="initiative-band">
      <div className="initiative-band-media" data-hover-target data-reveal>
        {section.image && (
          <Image
            src={section.image}
            alt=""
            fill
            sizes="100vw"
            className="initiative-band-image"
          />
        )}

        <div className="initiative-band-overlay" aria-hidden="true" />

        <div className="initiative-band-caption" aria-hidden="true">
          <span>{section.title}</span>
          <span>{section.body}</span>
        </div>
      </div>
    </section>
  );
}

function renderImpactWhy(section: ResolvedSection): ReactNode {
  return (
    <section className="initiative-why">
      <SectionHeader
        index="01"
        label={section.eyebrow}
        className="initiative-section-header"
      />

      <div className="initiative-why-grid">
        <h2 data-reveal>
          <Heading text={section.title} />
        </h2>

        <div className="initiative-why-text">
          {paragraphs(section.body).map((paragraph, index) => (
            <p key={index} data-reveal>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="initiative-values">
        {section.items.map((value, index) => (
          <article
            key={index}
            className="initiative-value"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 80}ms` }}
          >
            <span>{pad(index + 1)}</span>
            <h3>{value.title}</h3>
            <p>{value.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderImpactProcess(section: ResolvedSection): ReactNode {
  return (
    <section className="initiative-process">
      <SectionHeader
        index="02"
        label={section.eyebrow}
        className="initiative-section-header"
      />

      <div className="initiative-process-head">
        <h2 data-reveal>
          <Heading text={section.title} />
        </h2>

        <p data-reveal>{section.body}</p>
      </div>

      <div className="initiative-flow" data-reveal>
        {section.items.map((stage, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <span className="initiative-flow-arrow" aria-hidden="true">
                &rarr;
              </span>
            )}
            <span className="initiative-flow-stage">{stage.title}</span>
          </Fragment>
        ))}
      </div>

      <div className="initiative-steps">
        {section.items.map((step, index) => (
          <article
            key={index}
            className="initiative-step"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 80}ms` }}
          >
            <span>{pad(index + 1)}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderImpactExamples(section: ResolvedSection): ReactNode {
  return (
    <section className="initiative-examples">
      <SectionHeader
        index="03"
        label={section.eyebrow}
        className="initiative-section-header"
      />

      <div className="initiative-examples-head">
        <h2 data-reveal>
          <Heading text={section.title} />
        </h2>

        <p data-reveal>{section.body}</p>
      </div>

      <div className="initiative-cards">
        {section.items.map((item, index) => (
          <article
            key={index}
            className="initiative-card"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 80}ms` }}
          >
            <span>{pad(index + 1)}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderImpactCta(
  section: ResolvedSection,
  ctx: Ctx,
): ReactNode {
  const [firstNote, secondNote] = section.items;

  return (
    <section className="initiative-cta">
      <SectionHeader
        index="04"
        label={section.eyebrow}
        className="initiative-section-header"
      />

      <div className="initiative-cta-content">
        <h2 data-reveal>
          <Heading text={section.title} />
        </h2>

        <div className="initiative-cta-side">
          <p data-reveal>{section.body}</p>

          <Link
            href={section.href || `/${ctx.locale}/contact`}
            className="initiative-cta-button"
            data-hover-target
            data-reveal
          >
            <span>{section.ctaLabel}</span>
            <span aria-hidden="true">&#8599;</span>
          </Link>
        </div>
      </div>

      <div className="initiative-cta-line" />

      <div className="initiative-cta-bottom">
        <span>{firstNote?.title}</span>
        <span>{secondNote?.title}</span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Generic renderers (for new pages)                                  */
/* ------------------------------------------------------------------ */

function renderRichText(section: ResolvedSection): ReactNode {
  return (
    <section className="cms-section">
      <div className="cms-section-inner">
        {section.eyebrow && <span className="cms-eyebrow">{section.eyebrow}</span>}
        {section.title && (
          <h2 className="cms-title">
            <Heading text={section.title} />
          </h2>
        )}
        <div className="cms-body">
          <RichBody text={section.body} />
        </div>
      </div>
    </section>
  );
}

function renderText(section: ResolvedSection): ReactNode {
  return (
    <section className="cms-section">
      <div className="cms-section-inner">
        {section.eyebrow && <span className="cms-eyebrow">{section.eyebrow}</span>}
        {section.title && (
          <h2 className="cms-title">
            <Heading text={section.title} />
          </h2>
        )}
        {section.body && <p className="cms-paragraph">{section.body}</p>}
      </div>
    </section>
  );
}

function renderGenericCta(
  section: ResolvedSection,
  ctx: Ctx,
): ReactNode {
  return (
    <section className="cms-section cms-cta-section">
      <div className="cms-section-inner">
        {section.eyebrow && <span className="cms-eyebrow">{section.eyebrow}</span>}
        <h2 className="cms-title">
          <Heading text={section.title} />
        </h2>
        {section.body && <p className="cms-paragraph">{section.body}</p>}

        {section.ctaLabel && (
          <Link
            href={section.href || `/${ctx.locale}/contact`}
            className="cms-cta-button"
            data-hover-target
          >
            <span>{section.ctaLabel}</span>
            <span aria-hidden="true">&#8599;</span>
          </Link>
        )}
      </div>
    </section>
  );
}

function renderGenericImage(section: ResolvedSection): ReactNode {
  return (
    <section className="cms-image-section">
      <div className="cms-image" data-hover-target>
        {section.image && (
          <Image
            src={section.image}
            alt={section.title}
            fill
            sizes="100vw"
            className="cms-image-content"
          />
        )}

        <div className="cms-image-overlay" />

        <div className="cms-image-caption">
          <span>{section.title}</span>
          <span>{section.body}</span>
        </div>
      </div>
    </section>
  );
}

function renderLegalDocument(section: ResolvedSection): ReactNode {
  return (
    <>
      <section className="legal-hero">
        <div className="legal-hero-meta">
          <span>{section.eyebrow || "LEGAL"}</span>
          <span />
        </div>

        <h1>{section.title}</h1>
      </section>

      <section className="legal-body">
        <RichBody text={section.body} />
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Registry                                                           */
/* ------------------------------------------------------------------ */

type Renderer = (section: ResolvedSection, ctx: Ctx) => ReactNode;

const RENDERERS: Record<string, Renderer> = {
  "home-hero": renderHomeHero,
  "home-approach": renderHomeApproach,
  "about-hero": renderAboutHero,
  "about-story": renderAboutStory,
  "about-values": renderAboutValues,
  "about-image": renderAboutImage,
  "about-closing": renderAboutClosing,
  "contact-hero": renderContactHero,
  "contact-info": renderContactInfo,
  "contact-form": renderContactForm,
  "contact-closing": (section) => renderContactClosing(section),
  "impact-hero": renderImpactHero,
  "impact-band": (section) => renderImpactBand(section),
  "impact-why": (section) => renderImpactWhy(section),
  "impact-process": (section) => renderImpactProcess(section),
  "impact-examples": (section) => renderImpactExamples(section),
  "impact-cta": renderImpactCta,
  "legal-document": (section) => renderLegalDocument(section),
  "rich-text": (section) => renderRichText(section),
  text: (section) => renderText(section),
  cta: renderGenericCta,
  image: (section) => renderGenericImage(section),
};

export function PageSections({
  page,
  dict,
  locale,
}: {
  page: ResolvedPage;
  dict: Dictionary;
  locale: Locale;
}) {
  const ctx = { dict, locale };

  return (
    <>
      {page.sections.map((section) => {
        const renderer = RENDERERS[section.type];

        if (!renderer) return null;

        return (
          <Fragment key={section.key}>{renderer(section, ctx)}</Fragment>
        );
      })}
    </>
  );
}

export function hasSectionRenderer(type: string): boolean {
  return type in RENDERERS;
}

export default PageSections;

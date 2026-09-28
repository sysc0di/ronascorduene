import type { Metadata } from "next";

import { getDictionary, getDictionaryFor } from "../dictionaries";
import "./Contact.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionaryFor(lang);

  return {
    title: dict.nav.contact,
    description: dict.contact.hero.body,
    alternates: {
      canonical: `/${lang}/contact`,
      languages: { en: "/en/contact", tr: "/tr/contact" },
    },
  };
}

export default async function ContactPage() {
  const dict = await getDictionary();
  const { contact } = dict;
  const { form } = contact;

  return (
    <main className="contact-page">
      {/* HERO */}

      <section className="contact-hero">
        <div className="contact-hero-meta">
          <span>02</span>
          <span>{contact.meta.hero}</span>
        </div>

        <div className="contact-hero-line" />

        <div className="contact-hero-content">
          <div className="contact-label">
            {contact.hero.label}
          </div>

          <h1>
            {contact.hero.titleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < contact.hero.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p>{contact.hero.body}</p>
        </div>
      </section>

      {/* CONTACT INFORMATION */}

      <section className="contact-info">
        <div className="contact-section-header">
          <span>01</span>
          <span>{contact.meta.info}</span>
        </div>

        <div className="contact-info-grid">
          <a
            href={`mailto:${contact.info.emailValue}`}
            className="contact-info-item"
            data-hover-target
          >
            <span className="contact-info-number">01</span>

            <div>
              <span className="contact-info-label">{contact.info.email}</span>
              <strong>{contact.info.emailValue}</strong>
            </div>

            <span className="contact-arrow">↗</span>
          </a>

          <div className="contact-info-item" data-hover-target>
            <span className="contact-info-number">02</span>

            <div>
              <span className="contact-info-label">{contact.info.location}</span>
              <strong>{contact.info.locationValue}</strong>
            </div>
          </div>

          <a
            href="#"
            className="contact-info-item"
            data-hover-target
          >
            <span className="contact-info-number">03</span>

            <div>
              <span className="contact-info-label">{contact.info.instagram}</span>
              <strong>{contact.info.instagramValue}</strong>
            </div>

            <span className="contact-arrow">↗</span>
          </a>
        </div>
      </section>

      {/* FORM */}

      <section className="contact-form-section">
        <div className="contact-section-header">
          <span>02</span>
          <span>{contact.meta.form}</span>
        </div>

        <form className="contact-form">
          <div className="contact-form-row">
            <label>
              <span>{form.name}</span>

              <input
                type="text"
                name="name"
                placeholder={form.namePlaceholder}
              />
            </label>

            <label>
              <span>{form.email}</span>

              <input
                type="email"
                name="email"
                placeholder={form.emailPlaceholder}
              />
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

          <button
            type="submit"
            className="contact-submit"
            data-hover-target
          >
            <span>{form.submit}</span>
            <span>↗</span>
          </button>
        </form>
      </section>

      {/* BOTTOM */}

      <section className="contact-bottom">
        <div className="contact-bottom-line" />

        <div className="contact-bottom-content">
          <span>{contact.closing.brand}</span>

          <strong>
            {contact.closing.titleLines[0]}
            <br />
            {contact.closing.titleLines[1]}
          </strong>

          <span>{contact.closing.label}</span>
        </div>
      </section>
    </main>
  );
}

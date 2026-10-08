"use client";

import { useState } from "react";

import type { Dictionary } from "../dictionaries";

type Fields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMPTY: Fields = { name: "", email: "", subject: "", message: "" };

/**
 * The contact form hands the message to the visitor's mail client addressed to
 * the published inbox, then shows a confirmation. There is no message endpoint
 * in this app, and a form with no action would simply reload the page and lose
 * everything typed — so the mail handoff is what makes the form work at all.
 *
 * The submit handler is the single place a real endpoint or an analytics event
 * would slot in later.
 */
export default function ContactForm({
  dict,
  email,
}: {
  dict: Dictionary;
  email: string;
}) {
  const { form } = dict.contact;
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [handedOff, setHandedOff] = useState(false);

  const update =
    (field: keyof Fields) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ) => {
      const { value } = event.currentTarget;

      setFields((current) => ({ ...current, [field]: value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = fields.subject.trim()
      ? `${dict.contact.form.subject}: ${fields.subject.trim()}`
      : dict.contact.form.subjectPlaceholder;

    const body = [
      `${form.name}: ${fields.name}`,
      `${form.email}: ${fields.email}`,
      "",
      fields.message,
    ].join("\n");

    const href =
      `mailto:${email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setHandedOff(true);
  };

  if (handedOff) {
    return (
      <section className="contact-form-section">
        <div className="contact-form-done">
          <strong>{form.mailSent}</strong>

          <p>{form.mailNotice}</p>

          <a href={`mailto:${email}`} data-hover-target>
            {email}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-form-section">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <label>
            <span>{form.name}</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder={form.namePlaceholder}
              required
              value={fields.name}
              onChange={update("name")}
            />
          </label>

          <label>
            <span>{form.email}</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={form.emailPlaceholder}
              required
              value={fields.email}
              onChange={update("email")}
            />
          </label>
        </div>

        <label>
          <span>{form.subject}</span>
          <input
            type="text"
            name="subject"
            placeholder={form.subjectPlaceholder}
            value={fields.subject}
            onChange={update("subject")}
          />
        </label>

        <label>
          <span>{form.message}</span>
          <textarea
            name="message"
            rows={6}
            placeholder={form.messagePlaceholder}
            required
            value={fields.message}
            onChange={update("message")}
          />
        </label>

        <button type="submit" className="contact-submit" data-hover-target>
          <span>{form.submit}</span>
          <span>&#8599;</span>
        </button>

        <p className="contact-form-notice">{form.mailNotice}</p>
      </form>
    </section>
  );
}
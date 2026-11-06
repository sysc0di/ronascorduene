"use client";

import Link from "next/link";

import type { Dictionary } from "../[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import { LEGAL_LINKS } from "@/lib/legal";

import "./Footer.css";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const base = `/${locale}`;

  const links = [
    { key: "home", href: "" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
    { key: "store", href: "/store" },
    { key: "track", href: "/track" },
  ] as const;

  return (
    <footer className="footer">
      <div className="footer-line" />

      <div className="footer-top">
        <div className="footer-brand">
          <div>
            <span className="footer-label">{dict.footer.brand}</span>
            <h2>
              {dict.footer.titleLines[0]}
              <br />
              {dict.footer.titleLines[1]}
            </h2>
          </div>
        </div>

        <nav className="footer-nav">
          {links.map((link) => (
            <Link
              key={link.key}
              href={`${base}${link.href}`}
              data-hover-target
            >
              {dict.nav[link.key]}
            </Link>
          ))}
        </nav>
      </div>

      <div className="footer-middle">
        <span>{dict.footer.middle}</span>
      </div>

      <nav className="footer-legal" aria-label={dict.legal.label}>
        {LEGAL_LINKS.map((link) => (
          <Link
            key={link.slug}
            href={`${base}/legal/${link.slug}`}
            data-hover-target
          >
            {dict.legal[link.labelKey]}
          </Link>
        ))}
      </nav>

      <div className="footer-line" />

      <div className="footer-bottom">
        <button
          type="button"
          className="footer-back-to-top"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          {dict.footer.backToTop}
        </button>

        <span>{dict.footer.copyright.replace("{year}", String(new Date().getFullYear()))}</span>

        <span>{dict.footer.label}</span>

        <span>{dict.footer.rights}</span>

        <span className="footer-credit">
          {dict.footer.builtBy}{" "}
          <a
            href="https://mithrabyte.com/?utm_source=ronascorduene&utm_medium=footer&utm_campaign=site_credit"
            target="_blank"
            rel="noopener noreferrer"
            data-hover-target
            onClick={() => {
              const w = window as unknown as {
                gtag?: (...args: unknown[]) => void;
                dataLayer?: unknown[];
              };
              if (typeof w.gtag === "function") {
                w.gtag("event", "outbound_click", {
                  link_url: "https://mithrabyte.com",
                  link_text: "Mithrabyte",
                  source: "footer",
                });
              } else if (Array.isArray(w.dataLayer)) {
                w.dataLayer.push({
                  event: "outbound_click",
                  link_url: "https://mithrabyte.com",
                  link_text: "Mithrabyte",
                  source: "footer",
                });
              }
            }}
          >
            Mithrabyte
          </a>
        </span>
      </div>
    </footer>
  );
}

import Link from "next/link";

import type { Dictionary } from "../[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";

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

      <div className="footer-line" />

      <div className="footer-bottom">
        <span>{dict.footer.copyright.replace("{year}", String(new Date().getFullYear()))}</span>

        <span>{dict.footer.label}</span>

        <span>{dict.footer.rights}</span>
      </div>
    </footer>
  );
}

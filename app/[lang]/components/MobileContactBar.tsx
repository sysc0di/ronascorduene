import Link from "next/link";

import type { Dictionary } from "../dictionaries";
import type { Locale } from "@/lib/i18n";

import "./MobileContactBar.css";

/**
 * Slim contact bar for small screens, where the navbar's contact link is behind
 * the menu. Rendered by the layout on the server, so it costs nothing until it
 * paints, and it hides itself on the list page — that page's own submit button
 * is the conversion there, and a fixed bar would sit on top of it.
 */
export default function MobileContactBar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="mobile-contact-bar">
      <Link
        href={`/${locale}/contact`}
        className="mobile-contact-bar-item"
        data-hover-target
      >
        {dict.nav.contact}
      </Link>

      <a
        href={`mailto:${dict.contact.info.emailValue}`}
        className="mobile-contact-bar-item"
      >
        {dict.sidebar.email}
      </a>
    </div>
  );
}
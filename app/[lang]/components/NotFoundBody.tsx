import Link from "next/link";

import type { Dictionary } from "../dictionaries";
import type { Locale } from "@/lib/i18n";

/**
 * The 404 body, shared by the locale-scoped `not-found.tsx` and the global
 * `global-not-found.tsx`. Kept separate from both because the global page
 * bypasses the layout and therefore cannot import anything that lives inside it.
 */
export default function NotFoundBody({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const t = dict.notFound;

  return (
    <main className="not-found">
      <div className="not-found-inner">
        <div className="not-found-meta">
          <span>{dict.store.title}</span>

          <span>{t.meta}</span>
        </div>

        <div className="not-found-line" />

        <div className="not-found-content">
          <span className="not-found-code">404</span>

          <h1>{t.title}</h1>

          <p>{t.body}</p>

          <div className="not-found-actions">
            <Link
              href={`/${locale}`}
              className="not-found-action"
              data-hover-target
            >
              <span>{t.home}</span>

              <span aria-hidden="true">&#8599;</span>
            </Link>

            <Link
              href={`/${locale}/store`}
              className="not-found-action"
              data-hover-target
            >
              <span>{t.store}</span>

              <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
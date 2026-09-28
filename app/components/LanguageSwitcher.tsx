"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  LOCALE_COOKIE,
  localeLabels,
  localeNames,
  locales,
  type Locale,
} from "@/lib/i18n";

import "./LanguageSwitcher.css";

export function localePath(pathname: string, next: Locale) {
  const segments = pathname.split("/");

  if (locales.includes(segments[1] as Locale)) {
    segments[1] = next;
  } else {
    segments.splice(1, 0, next);
  }

  return segments.join("/") || `/${next}`;
}

const rememberLocale = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
};

export function LanguageSwitcher({
  locale,
  label,
  variant = "dropdown",
}: {
  locale: Locale;
  label: string;
  variant?: "dropdown" | "stacked";
}) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const options = locales.map((item) => (
    <Link
      key={item}
      href={localePath(pathname, item)}
      hrefLang={item}
      lang={item}
      className="lang-option"
      data-hover-target
      aria-current={item === locale ? "true" : undefined}
      onClick={() => {
        rememberLocale(item);
        setOpen(false);
      }}
    >
      <span className="lang-option-code">{localeLabels[item]}</span>

      <span className="lang-option-name">{localeNames[item]}</span>
    </Link>
  ));

  if (variant === "stacked") {
    return (
      <div className="lang-switch lang-switch-stacked" role="group" aria-label={label}>
        {options}
      </div>
    );
  }

  return (
    <div className="lang-dropdown" ref={rootRef}>
      <button
        type="button"
        className="lang-trigger"
        data-hover-target
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={label}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <svg
          className="lang-trigger-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>

        <span>{localeLabels[locale]}</span>

        <svg
          className="lang-trigger-caret"
          data-open={open || undefined}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div className="lang-menu" data-open={open || undefined} hidden={!open}>
        {options}
      </div>
    </div>
  );
}

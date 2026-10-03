"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "./LanguageSwitcher";

import type { Dictionary } from "../[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";

import "./Navbar.css";
import Image from "next/image";
import logo from "../../public/ronassimplelogo.png"
const links = [
  { key: "about", href: "/about" },
  { key: "initiative", href: "/initiative" },
  { key: "contact", href: "/contact" },
  { key: "store", href: "/store" },
  { key: "list", href: "/list" },
] as const;

export function Navbar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);

  const base = `/${locale}`;

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflowY = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflowY = "";
    };
  }, [open]);

  return (
    <nav className={open ? "navbar navbar-open" : "navbar"}>
      <div className="navbar-inner">

        <Link
          href={base}
          className="navbar-logo"
          data-hover-target
          onClick={() => setOpen(false)}
        >
          <Image
          className="navbar-logo-icon"
            src={logo} alt="ronas" />

        </Link>

        <div className="navbar-lang">
          <LanguageSwitcher
            locale={locale}
            label={dict.nav.language}
            variant="dropdown"
          />
        </div>

        {/* Horizontal row on desktop, slide-in drawer on mobile */}
        <div className="navbar-links" id="navbar-menu">
          {links.map((link) => (
            <Link
              key={link.key}
              href={`${base}${link.href}`}
              className="navbar-link"
              data-hover-target
              onClick={() => setOpen(false)}
            >
              {dict.nav[link.key]}
            </Link>
          ))}

          <div className="navbar-drawer-language">
            <LanguageSwitcher
              locale={locale}
              label={dict.nav.language}
              variant="stacked"
            />
          </div>
        </div>

        <button
          type="button"
          className="navbar-toggle"
          data-hover-target
          aria-expanded={open}
          aria-controls="navbar-menu"
          aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
        </button>

      </div>

      <button
        type="button"
        className="navbar-backdrop"
        aria-label={dict.nav.closeMenu}
        onClick={() => setOpen(false)}
      />
    </nav>
  );
}

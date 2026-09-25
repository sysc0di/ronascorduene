"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./Navbar.css";

const links = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/store", label: "Store" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

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

        <Link href="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <span>Ronas Corduene</span>

          <svg
            className="navbar-logo-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </Link>

        {/* Horizontal row on desktop, slide-in drawer on mobile */}
        <div className="navbar-links" id="navbar-menu">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="navbar-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="navbar-toggle"
          aria-expanded={open}
          aria-controls="navbar-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
        </button>

      </div>

      <button
        type="button"
        className="navbar-backdrop"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
      />
    </nav>
  );
}

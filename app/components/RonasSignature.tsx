import Image from "next/image";

import logo from "../../public/logo.svg";
import "./RonasSignature.css";

/**
 * Hero lockup: the mark above, the name written out below.
 *
 * The mark is decorative — the `h1` underneath carries the site name, so an
 * `alt` here would only make a screen reader announce it twice.
 */
export default function RonasSignature() {
  return (
    <div className="ronas-signature-wrap">
      <Image
        className="ronas-signature-logo"
        src={logo}
        alt=""
        priority
        sizes="(max-width: 640px) 64px, 96px"
      />

      <div className="ronas-signature-line">
        <h1 className="ronas-signature">Ronas Corduene</h1>

        {/* The pen travels with the reveal edge as the name is written. */}
        <span className="ronas-signature-pen" aria-hidden="true" />
      </div>
    </div>
  );
}

import Image from "next/image";

import logo from "@/public/ronas-logo.png";

import "./RonasLogo.css";

export default function RonasLogo({ alt }: { alt: string }) {
  return (
    <div className="ronas-logo-wrap">
      <Image src={logo} alt={alt} priority className="ronas-logo-img" />

      <svg
        className="ronas-logo-border"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          pathLength={100}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

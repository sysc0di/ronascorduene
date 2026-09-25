"use client";

import { useEffect, useState } from "react";
import "./ScrollIndicator.css"
export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollDown}
      aria-label="Scroll down"
      className={`
        fixed
        bottom-8
        left-1/2
        z-50
        -translate-x-1/2
        text-[#a6a6a6]
        transition-all
        duration-700
        ease-out
        group
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
      `}
    >
      <div className="relative h-24 w-16">

        {/* LEFT TIRE TRACK */}
        <div
          className="
            absolute
            left-[18px]
            top-0
            h-16
            w-[5px]
            overflow-hidden
            rounded-full
            opacity-70
          "
        >
          <div
            className="
              h-32
              w-full
              rounded-full
              bg-current
              animate-[trackMove_1.8s_linear_infinite]
            "
          />
        </div>

        {/* RIGHT TIRE TRACK */}
        <div
          className="
            absolute
            right-[18px]
            top-0
            h-16
            w-[5px]
            overflow-hidden
            rounded-full
            opacity-70
          "
        >
          <div
            className="
              h-32
              w-full
              rounded-full
              bg-current
              animate-[trackMove_1.8s_linear_infinite]
              [animation-delay:0.25s]
            "
          />
        </div>

        {/* TREAD CUTS */}
        <div className="absolute inset-x-0 top-0 h-16 opacity-30">
          <div className="absolute left-[14px] top-2 h-1 w-3 rotate-[25deg] bg-current" />
          <div className="absolute right-[14px] top-6 h-1 w-3 -rotate-[25deg] bg-current" />

          <div className="absolute left-[14px] top-10 h-1 w-3 rotate-[25deg] bg-current" />
          <div className="absolute right-[14px] top-14 h-1 w-3 -rotate-[25deg] bg-current" />
        </div>

        {/* CENTER ARROW */}
        <div
          className="
            absolute
            bottom-0
            left-1/2
            -translate-x-1/2
            transition-transform
            duration-300
            group-hover:translate-y-1
          "
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-[arrowBounce_1.6s_ease-in-out_infinite]"
          >
            <path
              d="M12 4V19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <path
              d="M6 13L12 19L18 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

      </div>
    </button>
  );
}

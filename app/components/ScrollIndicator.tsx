"use client";
import "./ScrollIndicator.css"
import { useEffect, useState } from "react";

export default function ScrollIndicator({ label }: { label: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero");

    if (!hero) return;

    // Eşik değerini hero'nun yüksekliğinin %20'si olarak sabitliyoruz.
    // Mobilde dvh sürekli değiştiği için bunu her scroll'da yeniden
    // ölçmek yerine, güncel yüksekliği anlık okuyoruz (state'te tutmuyoruz).
    const getThreshold = () => hero.getBoundingClientRect().height * 0.2;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY < getThreshold());
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // ilk yüklemede doğru state için

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollDown = () => {
    const hero = document.getElementById("hero");

    if (!hero) return;

    window.scrollTo({
      top: hero.offsetTop + hero.offsetHeight,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollDown}
      aria-label={label}
      data-hover-target
      className={`
        absolute
        bottom-8
        left-1/2
        z-[9999]
        -translate-x-1/2
        text-[#a6a6a6]
        transition-all
        duration-700
        ease-out
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }
      `}
    >
      <div className="relative h-24 w-16">

        {/* LEFT TRACK */}
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

        {/* RIGHT TRACK */}
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

        {/* TREAD */}
        <div className="absolute inset-x-0 top-0 h-16 opacity-30">
          <div className="absolute left-[14px] top-2 h-1 w-3 rotate-[25deg] bg-current" />
          <div className="absolute right-[14px] top-6 h-1 w-3 -rotate-[25deg] bg-current" />
          <div className="absolute left-[14px] top-10 h-1 w-3 rotate-[25deg] bg-current" />
          <div className="absolute right-[14px] top-14 h-1 w-3 -rotate-[25deg] bg-current" />
        </div>

        {/* ARROW */}
        <div
          data-hover-arrow
          className="
            absolute
            bottom-0
            left-1/2
            -translate-x-1/2
            transition-transform
            duration-300
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

"use client";

import "./RonasTitle.css";

export default function RonasTitle({
  titleLines,
}: {
  titleLines: readonly string[];
}) {
  return (
    <div className="ronas-title-wrap">

      <div className="ronas-title-line" />

      <h1 className="ronas-title">
        {titleLines.map((line) => (
          <span key={line} className="ronas-title-word">
            {line}
          </span>
        ))}
      </h1>

      <div className="ronas-title-line ronas-title-line-bottom" />

      <div className="ronas-light-sweep" />
    </div>
  );
}

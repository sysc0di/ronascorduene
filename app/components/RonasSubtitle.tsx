"use client";
import "./RonasSubtitle.css";

export default function RonasSubtitle({ text }: { text: string }) {
  return (
    <div className="ronas-subtitle">
      <span>{text}</span>
    </div>
  );
}

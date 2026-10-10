import type { Metadata } from "next";

import TrackForm from "./TrackForm";

import {
  getDictionary,
  getLocale,
  getLocaleFor,
} from "../dictionaries";
import { buildMetadata } from "@/lib/seo";

import "./Track.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/track">): Promise<Metadata> {
  const { lang } = await params;

  return buildMetadata({ locale: getLocaleFor(lang), page: "track" });
}

export default async function TrackPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.track;

  return (
    <main className="track-page">
      <section className="track-hero">
        <div className="track-meta">
          <span>05</span>
          <span>{t.meta}</span>
        </div>

        <div className="track-hero-line" />

        <div className="track-hero-content">
          <span className="track-eyebrow">{t.eyebrow}</span>

          <h1>
            {t.titleLines[0]}
            <br />
            {t.titleLines[1]}
          </h1>

          <p>{t.description}</p>
        </div>
      </section>

      <section className="track-content">
        <div className="track-form-wrap">
          <TrackForm locale={locale} track={t} />
        </div>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";

import {
  decimalToNumber,
  FALLBACK_CURRENCY,
  formatPrice,
  isCurrency,
  roundMoney,
  type Currency,
} from "@/lib/price";
import { pickTranslation } from "@/lib/product-text";
import { prisma } from "@/lib/prisma";
import { SITE_NAME } from "@/lib/seo";

import {
  getDictionaryFor,
  getLocaleFor,
  type Locale,
} from "../../dictionaries";

import "../Track.css";

/** Tracking codes are handed to the customer, so the page is per request. */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/track/[code]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocaleFor(lang);
  const dict = getDictionaryFor(locale);

  return {
    title: `${dict.track.meta} | ${SITE_NAME}`,
    description: dict.track.description,
    robots: { index: false, follow: false },
  };
}

/** Dictionary keys are lowercase; the stored status is uppercase. */
type StatusSlug =
  | "submitted"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

type StatusKey = Uppercase<StatusSlug>;

/** Everything other than the known statuses reads as submitted. */
function statusKey(status: string): StatusKey {
  switch (status) {
    case "PROCESSING":
    case "SHIPPED":
    case "COMPLETED":
    case "CANCELLED":
      return status;
    default:
      return "SUBMITTED";
  }
}

function statusSlug(status: StatusKey): StatusSlug {
  switch (status) {
    case "PROCESSING":
      return "processing";
    case "SHIPPED":
      return "shipped";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "submitted";
  }
}

const TIMELINE: { key: StatusKey; slug: StatusSlug }[] = [
  { key: "SUBMITTED", slug: "submitted" },
  { key: "PROCESSING", slug: "processing" },
  { key: "SHIPPED", slug: "shipped" },
  { key: "COMPLETED", slug: "completed" },
];

function formatDate(value: Date | null, locale: Locale): string {
  if (!value) return "";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

type TrackOrder = {
  status: string;
  currency: string | null;
  submittedAt: Date | null;
  shippedAt: Date | null;
  trackingCode: string;
  items: {
    quantity: number;
    unitPriceUsd: unknown;
    unitPriceTry: unknown;
    product: {
      translations: { locale: string; name: string }[];
    } | null;
  }[];
};

function buildView(
  order: TrackOrder,
  locale: Locale,
  dict: ReturnType<typeof getDictionaryFor>,
) {
  const t = dict.track;
  const currency: Currency = isCurrency(order.currency)
    ? order.currency
    : FALLBACK_CURRENCY;
  const key = statusKey(order.status);
  const slug = statusSlug(key);

  const items = order.items.map((item) => {
    const unit = decimalToNumber(
      currency === "USD" ? item.unitPriceUsd : item.unitPriceTry,
    );
    const line = unit === null ? null : roundMoney(unit * item.quantity);
    const name =
      pickTranslation(item.product?.translations ?? [], locale)?.name ?? "—";

    return {
      name,
      quantity: item.quantity,
      line,
      lineText: formatPrice(line, currency),
    };
  });

  const anyPriced = items.some((item) => item.line !== null);
  const total = formatPrice(
    roundMoney(items.reduce((sum, item) => sum + (item.line ?? 0), 0)),
    currency,
  );

  const reached =
    key === "CANCELLED"
      ? null
      : TIMELINE.findIndex((step) => step.key === key);

  return {
    statusLabel: t.statuses[slug],
    statusDescription: t.statuses[`${slug}Description`],
    reached,
    items,
    anyPriced,
    total,
    submittedAt: formatDate(order.submittedAt, locale),
    shippedAt: formatDate(order.shippedAt, locale),
  };
}

export default async function TrackStatusPage({
  params,
}: PageProps<"/[lang]/track/[code]">) {
  const { lang, code } = await params;
  const locale = getLocaleFor(lang);
  const dict = getDictionaryFor(locale);
  const t = dict.track;
  const normalized = code.trim().toUpperCase();

  const order = await prisma.order.findUnique({
    where: { trackingCode: normalized },
    select: {
      status: true,
      currency: true,
      submittedAt: true,
      shippedAt: true,
      trackingCode: true,
      items: {
        orderBy: { createdAt: "asc" },
        select: {
          quantity: true,
          unitPriceUsd: true,
          unitPriceTry: true,
          product: {
            select: {
              translations: { select: { locale: true, name: true } },
            },
          },
        },
      },
    },
  });

  const view = order ? buildView(order, locale, dict) : null;

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

      {order && view ? (
        <section className="track-status">
          <div className="track-status-card">
            <span className="track-status-label">
              {t.statuses.currentStatus}
            </span>

            <strong>{view.statusLabel}</strong>

            <p>{view.statusDescription}</p>
          </div>

          {view.reached !== null && (
            <ol className="track-timeline">
              {TIMELINE.map((step, index) => (
                <li
                  key={step.key}
                  className={
                    index <= (view.reached ?? 0)
                      ? "is-reached"
                      : undefined
                  }
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>

                  <em>{t.timeline[step.slug]}</em>
                </li>
              ))}
            </ol>
          )}

          <div className="track-summary">
            <dl className="track-facts">
              <div>
                <dt>{t.summary.orderNumber}</dt>
                <dd>{order.trackingCode}</dd>
              </div>

              <div>
                <dt>{t.summary.submittedAt}</dt>
                <dd>{view.submittedAt}</dd>
              </div>

              {view.shippedAt && (
                <div>
                  <dt>{t.summary.shippedAt}</dt>
                  <dd>{view.shippedAt}</dd>
                </div>
              )}
            </dl>

            <div className="track-items">
              <span className="track-items-header">{t.summary.items}</span>

              {view.items.map((item, index) => (
                <div className="track-item" key={`${item.name}-${index}`}>
                  <span className="track-item-name">{item.name}</span>

                  <span className="track-item-qty">
                    {String(item.quantity).padStart(2, "0")}
                  </span>

                  {item.line !== null ? (
                    <span className="track-item-line">{item.lineText}</span>
                  ) : (
                    <span className="track-item-line track-item-na">
                      {t.summary.priceOnRequest}
                    </span>
                  )}
                </div>
              ))}

              {view.anyPriced && (
                <div className="track-total">
                  <span>{t.summary.total}</span>
                  <span>{view.total}</span>
                </div>
              )}
            </div>
          </div>

          <div className="track-actions">
            <Link
              href={`/${locale}/track`}
              className="track-action"
              data-hover-target
            >
              <span>{t.summary.checkAnother}</span>

              <span aria-hidden="true">&#8599;</span>
            </Link>

            <Link
              href={`/${locale}`}
              className="track-action"
              data-hover-target
            >
              <span>{t.summary.backHome}</span>

              <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
        </section>
      ) : (
        <section className="track-status">
          <div className="track-not-found">
            <strong>{t.notFound.title}</strong>

            <p>{t.notFound.description}</p>
          </div>

          <div className="track-actions">
            <Link
              href={`/${locale}/track`}
              className="track-action"
              data-hover-target
            >
              <span>{t.summary.checkAnother}</span>

              <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
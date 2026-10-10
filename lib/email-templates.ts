import { getDictionaryFor } from "@/app/[lang]/dictionaries";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { orderInclude } from "@/lib/orders";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import {
  decimalToNumber,
  FALLBACK_CURRENCY,
  formatPrice,
  isCurrency,
  roundMoney,
  type Currency,
} from "@/lib/price";
import { pickTranslation } from "@/lib/product-text";

import type { Prisma } from "@/lib/generated/prisma/client";

/** The order payload shape shared by the created- and shipped-email senders. */
export type OrderWithItems = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

function esc(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/g, (char) => entities[char]);
}

function replaced(value: string, vars: Record<string, string>): string {
  return value.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

function resolveOrder(order: OrderWithItems) {
  const currency: Currency = isCurrency(order.currency)
    ? order.currency
    : FALLBACK_CURRENCY;
  const locale = (order.locale as Locale) || defaultLocale;
  const firstName = order.firstName?.trim() || "";

  return {
    currency,
    locale,
    firstName,
    trackingUrl: `${SITE_URL}/${locale}/track/${order.trackingCode}`,
  };
}

function itemRows(order: OrderWithItems, currency: Currency, locale: Locale) {
  const rows = order.items.map((item) => {
    const unit = decimalToNumber(
      currency === "USD" ? item.unitPriceUsd : item.unitPriceTry,
    );
    const line = unit === null ? null : roundMoney(unit * item.quantity);
    const name =
      pickTranslation(item.product?.translations ?? [], locale)?.name ?? "";

    return {
      name,
      quantity: item.quantity,
      line,
      lineText: formatPrice(line, currency),
    };
  });

  const total = formatPrice(
    roundMoney(rows.reduce((sum, row) => sum + (row.line ?? 0), 0)),
    currency,
  );

  return { rows, total };
}

function layout({
  locale,
  title,
  body,
  trackingCode,
  trackingUrl,
  rows,
  total,
  dict,
  thanks,
}: {
  locale: Locale;
  title: string;
  body: string;
  trackingCode: string;
  trackingUrl: string;
  rows: { name: string; quantity: number; lineText: string }[];
  total: string;
  dict: ReturnType<typeof getDictionaryFor>;
  thanks: string;
}) {
  const email = dict.email;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const right = dir === "rtl" ? "left" : "right";

  const itemRowsHtml = rows
    .map(
      (row) => `
                  <tr>
                    <td style="padding:8px 0;color:#40404a;font-size:14px;line-height:1.5;">${esc(row.name)}</td>
                    <td align="${right}" style="padding:8px 0;color:#6b6b72;font-size:13px;">${row.quantity} ×</td>
                    <td align="${right}" style="padding:8px 0;color:#101012;font-size:14px;font-weight:bold;white-space:nowrap;">${esc(row.lineText)}</td>
                  </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="${locale}" dir="${dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b0c;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0c;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
            <tr>
              <td style="padding:28px 32px;background:#101012;">
                <span style="color:#6b6b72;font-size:11px;letter-spacing:2px;">RONAS / CORDUENE</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;background:#ffffff;border-bottom:1px solid #e4e4e8;">
                <h1 style="margin:0 0 16px;color:#101012;font-size:24px;line-height:1.3;">${esc(title)}</h1>
                <p style="margin:0;color:#40404a;font-size:15px;line-height:1.6;">${esc(body)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;background:#f4f4f6;">
                <span style="display:block;color:#6b6b72;font-size:11px;letter-spacing:1px;">${esc(email.trackTitle)}</span>
                <span style="display:block;margin-top:8px;color:#101012;font-size:16px;font-weight:bold;">${esc(replaced(email.orderNumber, { code: trackingCode }))}</span>
                <a href="${esc(trackingUrl)}" style="display:inline-block;margin-top:16px;padding:12px 20px;background:#101012;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold;">${esc(email.trackButton)} ↗</a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;background:#ffffff;">
                <span style="display:block;margin-bottom:8px;color:#6b6b72;font-size:11px;letter-spacing:1px;">${esc(email.itemsTitle)}</span>
                ${itemRowsHtml}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                  <tr>
                    <td style="padding:12px 0 0;border-top:1px solid #e4e4e8;color:#101012;font-size:13px;font-weight:bold;">${esc(email.total)}</td>
                    <td align="${right}" style="padding:12px 0 0;border-top:1px solid #e4e4e8;color:#101012;font-size:13px;font-weight:bold;">${esc(total)}</td>
                  </tr>
                </table>
                <p style="margin:32px 0 0;color:#40404a;font-size:14px;line-height:1.6;">${esc(thanks)}</p>
                <p style="margin:8px 0 0;color:#101012;font-size:14px;">${SITE_NAME}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;background:#0b0b0c;">
                <span style="color:#6b6b72;font-size:11px;line-height:1.6;">${esc(email.footer)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildCreatedMail(order: OrderWithItems) {
  const { locale, currency, firstName, trackingUrl } = resolveOrder(order);
  const dict = getDictionaryFor(locale);
  const email = dict.email;
  const { rows, total } = itemRows(order, currency, locale);

  const title = email.createdTitle;
  const body = replaced(email.createdBody, { name: firstName });

  const html = layout({
    locale,
    title,
    body,
    trackingCode: order.trackingCode,
    trackingUrl,
    rows,
    total,
    dict,
    thanks: replaced(email.thanks, { name: firstName }),
  });

  const text = [
    email.createdTitle,
    "",
    replaced(email.createdBody, { name: firstName }),
    "",
    replaced(email.orderNumber, { code: order.trackingCode }),
    `${email.trackButton}: ${trackingUrl}`,
  ].join("\n");

  return { subject: email.createdSubject, html, text };
}

export function buildShippedMail(order: OrderWithItems) {
  const { locale, currency, firstName, trackingUrl } = resolveOrder(order);
  const dict = getDictionaryFor(locale);
  const email = dict.email;
  const { rows, total } = itemRows(order, currency, locale);

  const title = email.shippedTitle;
  const body = replaced(email.shippedBody, { name: firstName });

  const html = layout({
    locale,
    title,
    body,
    trackingCode: order.trackingCode,
    trackingUrl,
    rows,
    total,
    dict,
    thanks: replaced(email.thanks, { name: firstName }),
  });

  const text = [
    email.shippedTitle,
    "",
    replaced(email.shippedBody, { name: firstName }),
    "",
    replaced(email.orderNumber, { code: order.trackingCode }),
    `${email.trackButton}: ${trackingUrl}`,
  ].join("\n");

  return { subject: email.shippedSubject, html, text };
}
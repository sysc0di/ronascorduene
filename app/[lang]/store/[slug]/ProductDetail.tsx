"use client";

import Image from "next/image";
import Link from "next/link";

import { useLocalList } from "@/lib/order-storage";
import { useCurrency } from "@/lib/use-currency";
import {
  CURRENCIES,
  discountAmount,
  discountPercentOf,
  effectivePrice,
  formatPrice,
  isDiscounted,
  selectMoney,
  type Currency,
} from "@/lib/price";

import type { ProductDetail as Product } from "@/lib/order-types";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "../../dictionaries";

import "./ProductDetail.css";

/** Kept on the page so a visitor can walk back into the catalog they came
 *  from instead of landing on an unfiltered grid. */
function catalogHref(locale: Locale, family: string): string {
  return `/${locale}/store?family=${encodeURIComponent(family)}`;
}

export default function ProductDetail({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const [currency, setCurrency] =
    useCurrency(locale);

  const { count: listCount, has: inList, add: addToList } =
    useLocalList();

  const t = dict.store;
  const detail = t.detail;
  const contactLabel = dict.nav.contact;

  const added = inList(product.id);

  const money = selectMoney(product, currency);

  /* Material, construction and finish are slugs shared with the catalog
     filters, so their labels come from the dictionaries; the technical
     details carry their own per-language labels from the database. */
  const specs = [
    {
      label: t.filters.material,
      value:
        t.materials[
          product.material as keyof typeof t.materials
        ] ?? product.material,
    },
    {
      label: t.filters.construction,
      value:
        t.constructions[
          product.construction as keyof typeof t.constructions
        ] ?? product.construction,
    },
    {
      label: t.filters.finish,
      value:
        t.finishes[
          product.finish as keyof typeof t.finishes
        ] ?? product.finish,
    },
    ...product.technicalDetails,
  ];

  return (
    <div className="product-detail">
      <div className="product-detail-bar">
        <Link
          href={catalogHref(
            locale,
            product.family
          )}
          className="product-detail-back"
          data-hover-target
        >
          <span aria-hidden="true">←</span>

          <span>{detail.back}</span>
        </Link>

        <div className="product-detail-bar-actions">
          {listCount > 0 && (
            <Link
              href={`/${locale}/list`}
              className="product-detail-list-link"
              data-hover-target
            >
              <span>{t.goToList}</span>

              <span className="product-detail-list-count">
                {String(
                  listCount
                ).padStart(2, "0")}
              </span>
            </Link>
          )}

          <label className="product-detail-currency">
            <span className="product-detail-currency-label">
              {t.currency}
            </span>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(
                  event.target.value as Currency
                )
              }
            >
              {CURRENCIES.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="product-detail-grid">
        <div className="product-detail-media">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="
              (max-width: 900px) 100vw,
              55vw
            "
            className="product-detail-image"
          />
        </div>

        <div className="product-detail-panel">
          <span className="product-detail-eyebrow">
            {
              t.families[
                product.family as keyof typeof t.families
              ] ?? product.family
            }{" / "}
            {
              t.subcategories[
                product.category as keyof typeof t.subcategories
              ] ?? product.category
            }
          </span>

          <h1>{product.name}</h1>

          {money.price !== null && (
            <div className="product-detail-price">
              {isDiscounted(money) ? (
                <>
                  <span className="product-detail-price-current">
                    {formatPrice(
                      effectivePrice(money),
                      currency
                    )}
                  </span>

                  <span className="product-detail-price-original">
                    {formatPrice(
                      money.price,
                      currency
                    )}
                  </span>

                  <span className="product-detail-price-badge">
                    -
                    {discountPercentOf(money) ?? 0}%
                  </span>

                  {discountAmount(money) !== null && (
                    <span className="product-detail-price-save">
                      {t.save}{" "}
                      {formatPrice(
                        discountAmount(money),
                        currency
                      )}
                    </span>
                  )}
                </>
              ) : (
                <span className="product-detail-price-current">
                  {formatPrice(
                    money.price,
                    currency
                  )}
                </span>
              )}
            </div>
          )}

          <p className="product-detail-description">
            {product.description}
          </p>

          <div className="product-detail-actions">
            <button
              type="button"
              className={`
                product-detail-add
                ${added ? "is-added" : ""}
              `}
              onClick={() =>
                addToList(product.id)
              }
              data-hover-target
            >
              <span>
                {added
                  ? t.addedToList
                  : t.addToList}
              </span>

              <span aria-hidden="true">
                {added ? "✓" : "+"}
              </span>
            </button>

            {/* Fitment and availability are answered per vehicle, so the
                enquiry route is the natural second step after the list. */}
            <Link
              href={`/${locale}/contact`}
              className="product-detail-contact"
              data-hover-target
            >
              <span>{contactLabel}</span>

              <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>

          <section className="product-detail-specs">
            <h2>{detail.specifications}</h2>

            <dl>
              {specs.map((spec, index) => (
                <div
                  key={`${index}-${spec.label}`}
                  className="product-detail-spec"
                >
                  <dt>{spec.label}</dt>

                  <dd>{spec.value}</dd>
                </div>
              ))}

              <div className="product-detail-spec">
                <dt>{detail.reference}</dt>

                <dd>{product.id}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

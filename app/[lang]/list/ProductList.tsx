"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { submitOrder } from "@/lib/order-client";
import { useLocalList } from "@/lib/order-storage";
import { useCurrency } from "@/lib/use-currency";
import {
  CURRENCIES,
  discountPercentOf,
  effectivePrice,
  formatPrice,
  isDiscounted,
  selectMoney,
  type Currency,
} from "@/lib/price";

import type { CatalogProduct } from "@/lib/order-types";
import type { StoredListItem } from "@/lib/order-storage";
import type { Dictionary } from "../dictionaries";
import type { Locale } from "@/lib/i18n";

import "./List.css";

type Props = {
  locale: Locale;
  dict: Dictionary;
  products: CatalogProduct[];
};

type Contact = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  notes: string;
};

const emptyContact: Contact = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  notes: "",
};

export default function ProductList({
  locale,
  dict,
  products,
}: Props) {
  const t = dict.list;

  const [currency, setCurrency] = useCurrency(locale);

  const {
    list,
    count,
    setQuantity,
    remove,
    clear,
  } = useLocalList();

  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [sent, setSent] = useState<StoredListItem[] | null>(null);

  const [contact, setContact] =
    useState<Contact>(emptyContact);

  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const items = sent ?? list.items;
  const total = sent
    ? sent.reduce((sum, item) => sum + item.quantity, 0)
    : count;

  const productById = new Map(
    products.map((product) => [product.id, product]),
  );

  /* Money totals come from the catalog prices; items whose product has no
     price (or was removed) contribute nothing to the total. */
  const totalPrice = items.reduce((sum, item) => {
    const product = productById.get(item.productId);
    const unit = product
      ? effectivePrice(selectMoney(product, currency))
      : null;

    return sum + (unit ?? 0) * item.quantity;
  }, 0);

  const originalTotal = items.reduce((sum, item) => {
    const product = productById.get(item.productId);
    const money = product
      ? selectMoney(product, currency)
      : null;

    return sum + (money?.price ?? 0) * item.quantity;
  }, 0);

  const savings = Math.max(originalTotal - totalPrice, 0);

  const updateField =
    (field: keyof Contact) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ) => {
      const { value } = event.currentTarget;

      setContact((current) => ({
        ...current,
        [field]: value,
      }));
    };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (list.items.length === 0) return;

    if (!acceptAgreement) {
      setErrors([t.consent.agreementRequiredError]);

      return;
    }

    setSending(true);
    setErrors([]);

    const result = await submitOrder({
      ...contact,
      currency,
      locale,
      acceptAgreement,
      marketingConsent,
      items: list.items,
    });

    if (!result.ok) {
      setErrors(result.errors);
      setSending(false);

      return;
    }

    /*
     * Gönderilen liste ekranda kalır, tarayıcıdaki kopya temizlenir.
     */
    setSent(list.items);
    clear();
    setSending(false);
  };

  return (
    <main className="list-page">
      {/* HERO */}

      <section className="list-hero">
        <div className="list-meta">
          <span>04</span>
          <span>{t.meta}</span>
        </div>

        <div className="list-hero-line" />

        <div className="list-hero-content">
          <span className="list-eyebrow">
            {t.label}
          </span>

          <h1>
            {sent ? t.success.title : t.title}
          </h1>

          <p>
            {sent
              ? t.success.description
              : t.description}
          </p>
        </div>
      </section>

      {/* CONTENT */}

      {items.length === 0 ? (
        <section className="list-empty">
          <span>{t.empty.title}</span>

          <p>{t.empty.description}</p>

        <Link
          href={`/${locale}/store`}
          className="list-back-link"
          data-hover-target
        >
          <span>{t.backToStore}</span>
          <span>↗</span>
        </Link>
      </section>
      ) : (
        <>
          {sent && (
            <section className="list-success">
              <strong>{t.success.title}</strong>

              <p>{t.success.description}</p>
            </section>
          )}

          <section className="list-content">
            {/* ITEMS */}

            <div className="list-items">
              <div className="list-section-header">
                <span>
                  {t.items} /{" "}
                  {String(total).padStart(2, "0")}
                </span>

                <div className="list-section-actions">
                  <label className="list-currency">
                    <span className="list-currency-label">
                      {dict.store.currency}
                    </span>

                    <select
                      value={currency}
                      onChange={(event) =>
                        setCurrency(event.target.value as Currency)
                      }
                    >
                      {CURRENCIES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  {!sent && (
                    <button
                      type="button"
                      className="list-clear"
                      onClick={clear}
                    >
                      {t.clear}
                    </button>
                  )}
                </div>
              </div>

              {items.map((item) => {
                const product =
                  productById.get(item.productId);
                const money = product
                  ? selectMoney(product, currency)
                  : null;

                return (
                  <article
                    key={item.productId}
                    className="list-item"
                    data-hover-target
                  >
                    <div className="list-item-image">
                      {product ? (
                        <Image
                          src={product.image}
                          alt={
                            product.name
                          }
                          fill
                          sizes="(max-width: 700px) 30vw, 160px"
                          className="list-item-img"
                        />
                      ) : (
                        <span className="list-item-missing">
                          —
                        </span>
                      )}
                    </div>

                    <div className="list-item-info">
                      <span className="list-item-category">
                        {product
                          ? dict.store.subcategories[
                              product.category as keyof typeof dict.store.subcategories
                            ]
                          : t.removed}
                      </span>

                      <h2>
                        {product?.name ??
                          "—"}
                      </h2>

                      {money && money.price !== null && (
                        <div className="list-item-price">
                          {isDiscounted(money) ? (
                            <>
                              <span className="list-item-price-current">
                                {formatPrice(
                                  effectivePrice(money),
                                  currency,
                                )}
                              </span>

                              <span className="list-item-price-original">
                                {formatPrice(money.price, currency)}
                              </span>

                              <span className="list-item-price-badge">
                                -{discountPercentOf(money) ?? 0}%
                              </span>
                            </>
                          ) : (
                            <span className="list-item-price-current">
                              {formatPrice(money.price, currency)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {!sent && product ? (
                      <div className="list-item-quantity">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              product.id,
                              item.quantity - 1,
                            )
                          }
                          aria-label={t.decrease}
                        >
                          −
                        </button>

                        <span>
                          {String(
                            item.quantity,
                          ).padStart(2, "0")}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              product.id,
                              item.quantity + 1,
                            )
                          }
                          aria-label={t.increase}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="list-item-quantity-static">
                        {String(item.quantity).padStart(2, "0")}
                      </span>
                    )}

                    {!sent && product && (
                      <button
                        type="button"
                        className="list-item-remove"
                        onClick={() =>
                          remove(product.id)
                        }
                      >
                        {t.remove}
                      </button>
                    )}
                  </article>
                );
              })}

              {totalPrice > 0 && (
                <div className="list-summary">
                  {savings > 0 && (
                    <>
                      <div className="list-summary-row">
                        <span>{t.subtotal}</span>
                        <span className="list-summary-strike">
                          {formatPrice(originalTotal, currency)}
                        </span>
                      </div>

                      <div className="list-summary-row">
                        <span>{t.savings}</span>
                        <span>
                          -{formatPrice(savings, currency)}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="list-summary-row list-summary-total">
                    <span>{t.total}</span>
                    <span>{formatPrice(totalPrice, currency)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CONTACT FORM */}

            {!sent && (
              <form
                className="list-form"
                onSubmit={handleSubmit}
              >
                <div className="list-section-header">
                  <span>{t.details}</span>
                </div>

                <p className="list-form-note">
                  {t.detailsDescription}
                </p>

                <div className="list-form-row">
                  <label>
                    <span>{t.firstName}</span>

                    <input
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      value={contact.firstName}
                      onChange={updateField(
                        "firstName",
                      )}
                      required
                    />
                  </label>

                  <label>
                    <span>{t.lastName}</span>

                    <input
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      value={contact.lastName}
                      onChange={updateField(
                        "lastName",
                      )}
                      required
                    />
                  </label>
                </div>

                <div className="list-form-row">
                  <label>
                    <span>{t.email}</span>

                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={contact.email}
                      onChange={updateField("email")}
                      required
                    />
                  </label>

                  <label>
                    <span>{t.phone}</span>

                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={contact.phone}
                      onChange={updateField("phone")}
                      required
                    />
                  </label>
                </div>

                <label>
                  <span>{t.notes}</span>

                  <textarea
                    name="notes"
                    rows={4}
                    placeholder={t.notesPlaceholder}
                    value={contact.notes}
                    onChange={updateField("notes")}
                  />
                </label>

                <div className="list-consent-group">
                  {/* 1. Mandatory order agreement */}
                  <label className="list-consent list-consent-required">
                    <input
                      type="checkbox"
                      name="acceptAgreement"
                      checked={acceptAgreement}
                      onChange={(event) =>
                        setAcceptAgreement(
                          event.target.checked,
                        )
                      }
                      required
                    />

                    <span className="list-consent-body">
                      <span className="list-consent-label">
                        {t.consent.agreementLabel}
                      </span>

                      <span className="list-consent-text">
                        {t.consent.agreementBefore}{" "}
                        <Link
                          href={`/${locale}/legal/distance-sales`}
                          className="list-consent-link"
                          data-hover-target
                        >
                          {dict.legal.distanceSales}
                        </Link>{" "}
                        {t.consent.agreementBetween}{" "}
                        <Link
                          href={`/${locale}/legal/pre-information`}
                          className="list-consent-link"
                          data-hover-target
                        >
                          {dict.legal.preInformation}
                        </Link>
                        {t.consent.agreementAfter}
                      </span>
                    </span>
                  </label>

                  {/* 2. KVKK information notice (not a consent) */}
                  <p className="list-consent list-consent-notice">
                    <span className="list-consent-body">
                      <span className="list-consent-label">
                        {t.consent.kvkkLabel}
                      </span>

                      <span className="list-consent-text">
                        {t.consent.kvkkBefore}{" "}
                        <Link
                          href={`/${locale}/legal/kvkk`}
                          className="list-consent-link"
                          data-hover-target
                        >
                          {t.consent.kvkkLink}
                        </Link>
                        {t.consent.kvkkAfter}
                      </span>
                    </span>
                  </p>

                  {/* 3. Optional marketing consent */}
                  <label className="list-consent list-consent-optional">
                    <input
                      type="checkbox"
                      name="marketingConsent"
                      checked={marketingConsent}
                      onChange={(event) =>
                        setMarketingConsent(
                          event.target.checked,
                        )
                      }
                    />

                    <span className="list-consent-body">
                      <span className="list-consent-label">
                        {t.consent.marketingLabel}
                      </span>

                      <span className="list-consent-text">
                        {t.consent.marketingText}
                      </span>
                    </span>
                  </label>
                </div>

                {errors.length > 0 && (
                  <ul className="list-errors">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                )}

                <div className="list-form-actions">
                  <button
                    type="submit"
                    className="list-submit"
                    disabled={sending}
                    data-hover-target
                  >
                    <span>
                      {sending
                        ? t.sending
                        : t.submit}
                    </span>

                    <span>↗</span>
                  </button>

                  <span className="list-total">
                    {totalPrice > 0 ? (
                      <>
                        {t.total}{" "}
                        {formatPrice(totalPrice, currency)}
                      </>
                    ) : (
                      <>
                        {t.items} /{" "}
                        {String(total).padStart(2, "0")}
                      </>
                    )}
                  </span>
                </div>
              </form>
            )}
          </section>
        </>
      )}
    </main>
  );
}
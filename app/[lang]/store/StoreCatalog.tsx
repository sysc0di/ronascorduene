"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

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

import type { CatalogProduct, CollectionSummary } from "@/lib/order-types";
import type { Dictionary } from "../dictionaries";
import type { Locale } from "@/lib/i18n";

import "./Store.css";

export default function StoreCatalog({
  products,
  collections,
  locale,
  dict,
}: {
  products: CatalogProduct[];
  collections: CollectionSummary[];
  locale: Locale;
  dict: Dictionary;
}) {
  /* The collection is URL state, so the browser's back button and shared
     links both land on the same filtered view. */
  const searchParams = useSearchParams();

  const requestedCollection = searchParams.get("collection");

  const activeCollection =
    collections.find(
      (collection) => collection.slug === requestedCollection,
    ) ?? null;

  const [search, setSearch] = useState("");

  const [filters, setFilters] =
    useState<Record<string, string>>({});

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [currency, setCurrency] = useCurrency(locale);

  const t = dict.store;

  /*
   * Liste tarayıcıda saklanır; ekleme işlemi hiçbir istek yapmaz.
   */
  const {
    count: listCount,
    has: inList,
    add: addToList,
  } = useLocalList();

  const handleAddToList = (
    productId: string
  ) => {
    addToList(productId);
  };

  /*
   * Aktif ürünler.
   */
  const filteredProducts = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return products.filter(
      (product) => {
        /*
         * COLLECTION
         */
        if (
          activeCollection &&
          !product.collections.some(
            (collection) =>
              collection.slug === activeCollection.slug,
          )
        ) {
          return false;
        }

        /*
         * SEARCH
         */
        if (normalizedSearch) {
          const searchableText = [
            product.name,
            product.description,
            ...product.collections.map(
              (collection) => collection.name,
            ),
          ]
            .join(" ")
            .toLowerCase();

          if (
            !searchableText.includes(
              normalizedSearch
            )
          ) {
            return false;
          }
        }

        /*
         * TECHNICAL SPECS
         */
        for (const [label, value] of Object.entries(filters)) {
          if (!value || value === "all") {
            continue;
          }

          if (
            !product.specs.some(
              (spec) => spec.label === label && spec.value === value,
            )
          ) {
            return false;
          }
        }

        return true;
      }
    );
  }, [
    activeCollection,
    filters,
    search,
    products,
  ]);

  /*
   * Technical-detail filters, built from the rows the available products
   * actually carry: one dropdown per spec label, values taken from the data.
   */
  const specFacets = useMemo(() => {
    const available = products.filter((product) => {
      if (!activeCollection) return true;

      return product.collections.some(
        (collection) =>
          collection.slug === activeCollection.slug,
      );
    });

    const facets = new Map<string, string[]>();

    for (const product of available) {
      for (const spec of product.specs) {
        const values = facets.get(spec.label) ?? [];

        if (!values.includes(spec.value)) {
          values.push(spec.value);
        }

        facets.set(spec.label, values);
      }
    }

    return [...facets.entries()].map(([label, values]) => ({
      label,
      values,
    }));
  }, [activeCollection, products]);

  /*
   * Reset
   */
  const resetFilters = () => {
    setFilters({});
    setSearch("");
    setMobileFiltersOpen(false);
  };

  const updateFilter = (label: string, value: string) => {
    setFilters((current) => {
      if (!value || value === "all") {
        return Object.fromEntries(
          Object.entries(current).filter(
            ([key]) => key !== label,
          ),
        );
      }

      return { ...current, [label]: value };
    });
  };

  return (
    <main className="store">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="store-hero">
        <div className="store-meta">
          <span>03</span>

          <span>
            RONAS / {t.catalog}
          </span>
        </div>

        <div className="store-hero-line" />

        <div className="store-hero-content">
          <span className="store-eyebrow">
            {t.eyebrow}
          </span>

          <h1>{t.title}</h1>

          <p>
            {t.description}
          </p>

          {/* The catalog sits directly below the hero, so the primary action
              is a jump into it rather than a link to the same page. */}
          <a
            href="#catalog"
            className="store-hero-cta"
            data-hover-target
          >
            <span>{t.allProducts}</span>

            <span aria-hidden="true">
              &#8595;
            </span>
          </a>
        </div>
      </section>

      {/* MAIN CATALOG */}

      <section
        id="catalog"
        className="store-layout"
      >
        <div className="store-content">
          {/* COLLECTION ROW */}

          {collections.length > 0 && (
            <nav
              className="store-collections"
              aria-label={t.collections}
            >
              <div className="store-collections-scroll">
                <Link
                  href={`/${locale}/store`}
                  scroll={false}
                  className={`store-collection${activeCollection === null ? " is-active" : ""}`}
                  aria-current={activeCollection === null ? "page" : undefined}
                >
                  {t.allProducts}
                </Link>

                {collections.map((collection) => {
                  const active = activeCollection?.id === collection.id;

                  return (
                    <Link
                      key={collection.id}
                      href={`/${locale}/store?collection=${encodeURIComponent(collection.slug)}`}
                      scroll={false}
                      className={`store-collection${active ? " is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {collection.name}
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}

          {/* HEADER */}

          <div className="store-content-header">
            <div>
              <span className="store-section-label">
                {activeCollection
                  ? activeCollection.name
                  : t.allProducts}
              </span>

              <div className="store-result-count">
                {String(
                  filteredProducts.length
                ).padStart(2, "0")}{" "}
                / {t.products}
              </div>
            </div>

            <div className="store-header-actions">
              <label className="store-currency">
                <span className="store-currency-label">
                  {t.currency}
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

              <button
                type="button"
                className="store-reset"
                onClick={resetFilters}
              >
                {t.reset}
              </button>

              {listCount > 0 && (
                <Link
                  href={`/${locale}/list`}
                  className="store-go-to-list"
                  data-hover-target
                >
                  <span>{t.goToList}</span>

                  <span className="store-go-to-list-count">
                    {String(
                      listCount
                    ).padStart(2, "0")}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* SEARCH + FILTER */}

          <div className="store-toolbar">
            <div className="store-search">
              <label htmlFor="store-search">
                {t.search}
              </label>

              <input
                id="store-search"
                type="search"
                placeholder={
                  t.searchPlaceholder
                }
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.currentTarget
                      .value
                  )
                }
              />
            </div>

            {specFacets.length > 0 && (
              <>
                <button
                  type="button"
                  className="store-filter-toggle"
                  onClick={() =>
                    setMobileFiltersOpen(
                      (value) => !value
                    )
                  }
                >
                  {t.detail.specifications}

                  <span>
                    {mobileFiltersOpen
                      ? "−"
                      : "+"}
                  </span>
                </button>

                <div
                  className={`
                    store-extra-filters
                    ${mobileFiltersOpen
                      ? "is-open"
                      : ""
                    }
                  `}
                >
                  {specFacets.map(({ label, values }) => (
                    <label
                      key={label}
                      className="store-filter"
                    >
                      <span>
                        {label}
                      </span>

                      <select
                        value={
                          filters[label] ??
                          "all"
                        }
                        onChange={(event) =>
                          updateFilter(
                            label,
                            event
                              .currentTarget
                              .value
                          )
                        }
                      >
                        <option value="all">
                          {t.filters.all}
                        </option>

                        {values.map((option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* PRODUCTS */}

          {filteredProducts.length >
            0 ? (
            <div className="store-products">
              {filteredProducts.map(
                (
                  product,
                  index
                ) => {
                  const money = selectMoney(
                    product,
                    currency
                  );

                  return (
                    <article
                      key={
                        product.id
                      }
                      className="store-product"
                    >
                      <div className="store-product-image">
                        <Image
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          fill
                          sizes="
                            (max-width: 700px) 100vw,
                            (max-width: 1200px) 50vw,
                            45vw
                          "
                          className="store-product-img"
                        />

                        {/* The title below is the accessible link to the
                            product; this only widens the click target. */}
                        <Link
                          href={`/${locale}/store/${encodeURIComponent(product.id)}`}
                          className="store-product-image-link"
                          tabIndex={-1}
                          aria-hidden="true"
                        />

                        <span className="store-product-index">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        {product.collections[0] && (
                          <span className="store-product-collection">
                            {product.collections[0].name}
                          </span>
                        )}
                      </div>

                      <div className="store-product-info">
                        <div>
                          <h2>
                            <Link
                              href={`/${locale}/store/${encodeURIComponent(product.id)}`}
                              className="store-product-link"
                            >
                              <span>
                                {product.name}
                              </span>

                              <span
                                className="store-product-arrow"
                                aria-hidden="true"
                              >
                                →
                              </span>
                            </Link>
                          </h2>

                          <p>
                            {product.description}
                          </p>

                          {money.price !== null && (
                            <div className="store-product-price">
                              {isDiscounted(money) ? (
                                <>
                                  <span className="store-product-price-current">
                                    {formatPrice(
                                      effectivePrice(money),
                                      currency,
                                    )}
                                  </span>

                                  <span className="store-product-price-original">
                                    {formatPrice(
                                      money.price,
                                      currency,
                                    )}
                                  </span>

                                  <span className="store-product-price-badge">
                                    -{discountPercentOf(money) ?? 0}%
                                  </span>

                                  {discountAmount(money) !== null && (
                                    <span className="store-product-price-save">
                                      {t.save}{" "}
                                      {formatPrice(
                                        discountAmount(money),
                                        currency,
                                      )}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="store-product-price-current">
                                  {formatPrice(
                                    money.price,
                                    currency,
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          className={`
                            store-product-add
                            ${
                              inList(product.id)
                                ? "is-added"
                                : ""
                            }
                          `}
                          onClick={() =>
                            handleAddToList(
                              product.id
                            )
                          }
                          data-hover-target
                        >
                          <span>
                            {inList(product.id)
                              ? t.addedToList
                              : t.addToList}
                          </span>

                          <span>
                            {inList(product.id)
                              ? "✓"
                              : "+"}
                          </span>
                        </button>
                      </div>

                      {product.specs.length > 0 && (
                        <div className="store-product-specs">
                          {product.specs
                            .slice(0, 3)
                            .map((spec, specIndex) => (
                              <span
                                key={`${specIndex}-${spec.label}`}
                              >
                                {spec.value}
                              </span>
                            ))}
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div className="store-empty">
              <span>
                {t.empty.title}
              </span>

              <p>
                {t.empty.description}
              </p>

              <button
                type="button"
                onClick={
                  resetFilters
                }
              >
                {t.clear}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  CATEGORY_SLUGS,
  SUBCATEGORIES,
  type CategorySlug,
} from "@/lib/catalog-taxonomy";
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

import type { CatalogProduct } from "@/lib/order-types";
import type { Dictionary } from "../dictionaries";
import type { Locale } from "@/lib/i18n";

import "./Store.css";

type FamilyKey = CategorySlug;

type CategoryKey = keyof Dictionary["store"]["subcategories"];

type FilterKey =
  | "material"
  | "construction"
  | "finish";

const families: FamilyKey[] = [...CATEGORY_SLUGS];

/* Same source of truth as the admin panel. */
const familyCategories: Record<
  FamilyKey,
  CategoryKey[]
> = Object.fromEntries(
  CATEGORY_SLUGS.map((family) => [
    family,
    SUBCATEGORIES[family].map(
      (subcategory) => subcategory.slug as CategoryKey,
    ),
  ]),
) as Record<FamilyKey, CategoryKey[]>;

const filterKeys: FilterKey[] = [
  "material",
  "construction",
  "finish",
];

export default function StoreCatalog({
  products,
  locale,
  dict,
}: {
  products: CatalogProduct[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [activeFamily, setActiveFamily] =
    useState<FamilyKey | null>(null);

  const [activeCategory, setActiveCategory] =
    useState<CategoryKey | null>(null);

  const [openFamily, setOpenFamily] =
    useState<FamilyKey | null>(
      "airflow-dynamics"
    );

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filters, setFilters] =
    useState<
      Partial<Record<FilterKey, string>>
    >({});

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
   * Ana kategori seçimi.
   */
  const selectFamily = (
    family: FamilyKey
  ) => {
    setActiveFamily(family);
    setActiveCategory(null);

    setOpenFamily(family);

    setFilters({});

    setMobileMenuOpen(false);
    setMobileFiltersOpen(false);
  };

  /*
   * Alt kategori seçimi.
   */
  const selectCategory = (
    category: CategoryKey
  ) => {
    const product =
      products.find(
        (item) =>
          item.category === category
      );

    if (product) {
      setActiveFamily(
        product.family as FamilyKey
      );
    }

    setActiveCategory(category);
    setFilters({});

    setMobileMenuOpen(false);
    setMobileFiltersOpen(false);
  };

  /*
   * Tüm ürünler.
   */
  const selectAll = () => {
    setActiveFamily(null);
    setActiveCategory(null);

    setFilters({});

    setMobileMenuOpen(false);
    setMobileFiltersOpen(false);
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
         * FAMILY
         */
        if (
          activeFamily &&
          product.family !==
          activeFamily
        ) {
          return false;
        }

        /*
         * CATEGORY
         */
        if (
          activeCategory &&
          product.category !==
          activeCategory
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
            product.category,
            product.family,
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
         * ADDITIONAL FILTERS
         */
        for (
          const key of filterKeys
        ) {
          const selected =
            filters[key];

          if (
            !selected ||
            selected === "all"
          ) {
            continue;
          }

          if (
            product[key] !== selected
          ) {
            return false;
          }
        }

        return true;
      }
    );
  }, [
    activeFamily,
    activeCategory,
    filters,
    search,
    products,
  ]);

  /*
   * Filtre seçenekleri.
   */
  const filterOptions = useMemo(() => {
    const available =
      products.filter((product) => {
        if (
          activeFamily &&
          product.family !==
          activeFamily
        ) {
          return false;
        }

        if (
          activeCategory &&
          product.category !==
          activeCategory
        ) {
          return false;
        }

        return true;
      });

    return {
      material: [
        "all",
        ...Array.from(
          new Set(
            available.map(
              (item) =>
                item.material
            )
          )
        ),
      ],

      construction: [
        "all",
        ...Array.from(
          new Set(
            available.map(
              (item) =>
                item.construction
            )
          )
        ),
      ],

      finish: [
        "all",
        ...Array.from(
          new Set(
            available.map(
              (item) =>
                item.finish
            )
          )
        ),
      ],
    };
  }, [
    activeFamily,
    activeCategory,
    products,
  ]);

  /*
   * Reset
   */
  const resetFilters = () => {
    setActiveFamily(null);
    setActiveCategory(null);
    setFilters({});
    setSearch("");
    setMobileFiltersOpen(false);
  };

  const updateFilter = (
    key: FilterKey,
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
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
        </div>
      </section>

      {/* =================================================
          MOBILE CATEGORY BUTTON
      ================================================= */}

      <div className="store-mobile-controls">
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(true)
          }
        >
          <span>
            {t.categories}
          </span>

          <span className="store-control-icon">
            +
          </span>
        </button>
      </div>

      {/* =================================================
          MAIN CATALOG
      ================================================= */}

      <section className="store-layout">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className={`
            store-sidebar
            ${mobileMenuOpen
              ? "is-open"
              : ""
            }
          `}
        >
          <div className="store-sidebar-header">
            <span>
              {t.categories}
            </span>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              aria-label={t.close}
            >
              ×
            </button>
          </div>

          <div className="store-sidebar-content">
            {/* ALL */}

            <button
              type="button"
              className={`
                store-all-category
                ${activeFamily === null &&
                  activeCategory === null
                  ? "is-active"
                  : ""
                }
              `}
              onClick={selectAll}
            >
              <span>
                {t.allProducts}
              </span>

              <span>+</span>
            </button>

            {/* FAMILIES */}

            {families.map(
              (family) => {
                const isFamilyActive =
                  activeFamily ===
                  family;

                const isOpen =
                  openFamily ===
                  family;

                return (
                  <div
                    key={family}
                    className={`
                      store-family
                      ${isFamilyActive
                        ? "is-active"
                        : ""
                      }
                    `}
                  >
                    <button
                      type="button"
                      className="store-family-title"
                      onClick={() => {
                        setOpenFamily(
                          isOpen
                            ? null
                            : family
                        );

                        selectFamily(
                          family
                        );
                      }}
                    >
                      <span>
                        {
                          t.families[
                          family
                          ]
                        }
                      </span>

                      <span
                        className={`
                          store-family-symbol
                          ${isOpen
                            ? "is-open"
                            : ""
                          }
                        `}
                      >
                        +
                      </span>
                    </button>

                    <div
                      className={`
                        store-subcategories
                        ${isOpen
                          ? "is-open"
                          : ""
                        }
                      `}
                    >
                      {familyCategories[
                        family
                      ].map(
                        (category) => (
                          <button
                            key={
                              category
                            }
                            type="button"
                            className={
                              activeCategory ===
                                category
                                ? "is-active"
                                : ""
                            }
                            onClick={() =>
                              selectCategory(
                                category
                              )
                            }
                          >
                            {
                              t
                                .subcategories[
                              category
                              ]
                            }
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </aside>

        {/* MOBILE OVERLAY */}

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label={t.close}
            className="store-mobile-overlay"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />
        )}

        {/* =================================================
            PRODUCTS AREA
        ================================================= */}

        <div className="store-content">
          {/* HEADER */}

          <div className="store-content-header">
            <div>
              <span className="store-section-label">
                {activeCategory
                  ? t.subcategories[
                  activeCategory
                  ]
                  : activeFamily
                    ? t.families[
                    activeFamily
                    ]
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

            <button
              type="button"
              className="store-filter-toggle"
              onClick={() =>
                setMobileFiltersOpen(
                  (value) => !value
                )
              }
            >
              {t.filters?.material ??
                "FILTERS"}

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
              {filterKeys.map(
                (key) => (
                  <label
                    key={key}
                    className="store-filter"
                  >
                    <span>
                      {
                        t.filters[
                        key
                        ]
                      }
                    </span>

                    <select
                      value={
                        filters[key] ??
                        "all"
                      }
                      onChange={(
                        event
                      ) =>
                        updateFilter(
                          key,
                          event
                            .currentTarget
                            .value
                        )
                      }
                    >
                      {filterOptions[
                        key
                      ].map(
                        (option) => (
                          <option
                            key={
                              option
                            }
                            value={
                              option
                            }
                          >
                            {option ===
                              "all"
                              ? t
                                .filters
                                .all
                              : option}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                )
              )}
            </div>
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

                        <span className="store-product-index">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="store-product-category">
                          {
                            t.subcategories[
                            product.category as CategoryKey
                            ]
                          }
                        </span>
                      </div>

                      <div className="store-product-info">
                        <div>
                          <span className="store-product-family">
                            {
                              t.families[
                              product.family as FamilyKey
                              ]
                            }
                          </span>

                          <h2>
                            {product.name}
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

                      <div className="store-product-specs">
                        <span>
                          {
                            t.materials[
                            product.material as keyof typeof t.materials
                            ]
                          }
                        </span>

                        <span>
                          {
                            t.constructions[
                            product.construction as keyof typeof t.constructions
                            ]
                          }
                        </span>

                        <span>
                          {
                            t.finishes[
                            product.finish as keyof typeof t.finishes
                            ]
                          }
                        </span>
                      </div>
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

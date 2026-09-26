"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import products from "./storeData.json";

import type { Dictionary } from "../dictionaries";

import "./Store.css";

type StoreDict = Dictionary["store"];

const categories = [
  "ALL",
  "WHEELS",
  "EXTERIOR",
  "PERFORMANCE",
  "ACCESSORIES",
] as const;

type Category = (typeof categories)[number];

type Product = (typeof products)[number];

type FilterKey =
  | "material"
  | "diameter"
  | "width"
  | "construction"
  | "finish"
  | "application"
  | "component"
  | "system"
  | "type";

const filterKeys: Record<Exclude<Category, "ALL">, readonly FilterKey[]> = {
  WHEELS: [
    "diameter",
    "width",
    "construction",
    "material",
    "finish",
    "application",
  ],
  EXTERIOR: ["component", "material"],
  PERFORMANCE: ["system", "material"],
  ACCESSORIES: ["type", "material"],
};

export default function StoreCatalog({ dict }: { dict: StoreDict }) {
  const [category, setCategory] =
    useState<Category>("ALL");

  const [filters, setFilters] = useState<
    Record<string, string>
  >({});

  const [search, setSearch] = useState("");

  /*
   * Spec değerleri JSON içinde kanonik İngilizce
   * anahtar olarak tutulur; ekranda gösterilecek metin
   * sözlükteki karşılığına çevrilir. Böylece filtre
   * state'i çeviriden bağımsız kalır.
   *
   * Sözlük anahtarları JSON'dan türetildiği için
   * burada serbest string indekslemeye açılır.
   */
  const terms = dict.terms as Record<string, string>;

  const items = dict.items as Record<
    string,
    { name: string; description: string }
  >;

  const term = (value: string) => terms[value] ?? value;

  /*
   * Aktif kategoriye ait filtreler.
   *
   * ALL seçiliyken hiçbir kategori filtresi
   * gösterilmiyor.
   */
  const activeFilters = useMemo(() => {
    if (category === "ALL") {
      return [];
    }

    return filterKeys[category];
  }, [category]);

  /*
   * Kategori değiştiğinde:
   *
   * 1. Kategori değişir.
   * 2. Önceki kategoriye ait filtreler temizlenir.
   *
   * Böylece örneğin WHEELS'den EXTERIOR'a
   * geçerken DIAMETER gibi eski filtreler
   * ürünleri yanlışlıkla etkilemez.
   */
  const changeCategory = (value: string) => {
    const nextCategory = value as Category;

    setCategory(nextCategory);
    setFilters({});
  };

  /*
   * Aktif kategoriye göre filtre seçeneklerini
   * JSON içerisindeki gerçek ürünlerden oluştur.
   */
  const filterOptions = useMemo(() => {
    if (category === "ALL") {
      return {};
    }

    const categoryProducts = products.filter(
      (product) =>
        product.category === category
    );

    const result: Record<string, string[]> = {};

    filterKeys[category].forEach(
      (key) => {
        const values = categoryProducts
          .map((product) => {
            const value =
              product[
                key as keyof Product
              ];

            if (
              value === undefined ||
              value === null ||
              value === ""
            ) {
              return null;
            }

            return String(value);
          })
          .filter(
            (value): value is string =>
              value !== null
          );

        result[key] = [
          "ALL",
          ...Array.from(
            new Set(values)
          ),
        ];
      }
    );

    return result;
  }, [category]);

  /*
   * ÜRÜNLER
   *
   * Önce kategori,
   * sonra arama,
   * sonra kategoriye özel filtreler
   * uygulanıyor.
   */
  const filteredProducts = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return products.filter((product) => {
      /*
       * CATEGORY
       */
      if (
        category !== "ALL" &&
        product.category !== category
      ) {
        return false;
      }

      /*
       * SEARCH
       */
      if (searchValue) {
        const copy = items[product.id];

        const haystack = [
          product.name,
          product.description,
          copy?.name,
          copy?.description,
        ]
          .filter(
            (value): value is string =>
              typeof value === "string"
          )
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(searchValue)) {
          return false;
        }
      }

      /*
       * CATEGORY-SPECIFIC FILTERS
       */
      if (category !== "ALL") {
        const keysForCategory =
          filterKeys[category];

        for (const key of keysForCategory) {
          const selectedValue = filters[key];

          /*
           * ALL veya boş ise filtre
           * uygulanmıyor.
           */
          if (
            !selectedValue ||
            selectedValue === "ALL"
          ) {
            continue;
          }

          const productValue =
            product[
              key as keyof Product
            ];

          /*
           * Üründe bu değer yoksa
           * ürün eşleşmiyor.
           */
          if (
            productValue === undefined ||
            productValue === null
          ) {
            return false;
          }

          if (
            String(productValue) !==
            selectedValue
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [category, filters, search, items]);

  /*
   * Filtre değiştirme
   */
  const updateFilter = (
    key: FilterKey,
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /*
   * Her şeyi sıfırla
   */
  const resetFilters = () => {
    setCategory("ALL");
    setFilters({});
    setSearch("");
  };

  return (
    <main className="store">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="store-hero">
        <div className="store-meta">
          <span>03</span>

          <span>{dict.meta}</span>
        </div>

        <div className="store-line" />

        <div className="store-hero-content">
          <span className="store-label">
            {dict.label}
          </span>

          <h1>
            {dict.titleLines[0]}
            <br />
            {dict.titleLines[1]}
          </h1>

          <p>{dict.body}</p>
        </div>
      </section>

      {/* ==================================================
          CATALOG
      ================================================== */}

      <section className="store-catalog">
        {/* FILTER HEADER */}

        <div className="store-filter-header">
          <div>
            <span className="store-filter-count">
              {filteredProducts.length
                .toString()
                .padStart(2, "0")}
            </span>

            <span>{dict.products}</span>
          </div>

          <button
            type="button"
            onClick={resetFilters}
          >
            {dict.resetFilters}
          </button>
        </div>

        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="store-filters">
          {/* CATEGORY */}

          <Filter
            key={`category-${category}`}
            label={dict.filters.category}
            value={category}
            options={categories.map((value) => ({
              value,
              label: value === "ALL" ? dict.all : term(value),
            }))}
            onChange={changeCategory}
          />

          {/* CATEGORY-SPECIFIC FILTERS */}

          {activeFilters.map((key) => (
            <Filter
              key={`${category}-${key}`}
              label={dict.filters[key]}
              value={filters[key] ?? "ALL"}
              options={(filterOptions[key] ?? ["ALL"]).map(
                (value) => ({
                  value,
                  label:
                    value === "ALL" ? dict.all : term(value),
                })
              )}
              onChange={(value) =>
                updateFilter(key, value)
              }
            />
          ))}

          {/* SEARCH */}

          <div className="store-search">
            <label htmlFor="store-search">
              {dict.search}
            </label>

            <input
              id="store-search"
              type="search"
              placeholder={dict.searchPlaceholder}
              value={search}
              onChange={(event) =>
                setSearch(
                  event.currentTarget.value
                )
              }
            />
          </div>
        </div>

        {/* ==================================================
            PRODUCTS
        ================================================== */}

        <div className="store-products">
          {filteredProducts.map(
            (product) => {
              const copy = items[product.id];

              return (
                <article
                  key={product.id}
                  className="store-product"
                >
                  {/* IMAGE */}

                  <div className="store-product-image">
                    <Image
                      src={product.image}
                      alt={
                        copy?.name ?? product.name
                      }
                      fill
                      sizes="
                        (max-width: 600px) 100vw,
                        50vw
                      "
                      className="store-product-img"
                    />

                    <span className="store-product-number">
                      {product.id
                        .slice(-2)
                        .toUpperCase()}
                    </span>
                  </div>

                  {/* TITLE */}

                  <div className="store-product-info">
                    <div>
                      <span className="store-product-category">
                        {term(product.category)}
                      </span>

                      <h2>
                        {copy?.name ?? product.name}
                      </h2>
                    </div>

                    <span className="store-product-arrow">
                      ↗
                    </span>
                  </div>

                  {/* SPECS */}

                  <div className="store-product-specs">
                    {"diameter" in product &&
                      product.diameter && (
                        <span>
                          {product.diameter}
                          &quot;
                        </span>
                      )}

                    {"width" in product &&
                      product.width && (
                        <span>
                          {product.width}
                          &quot; {dict.widthSpec}
                        </span>
                      )}

                    {product.material && (
                      <span>
                        {term(product.material)}
                      </span>
                    )}

                    {"finish" in product &&
                      product.finish && (
                        <span>
                          {term(product.finish)}
                        </span>
                      )}

                    {"construction" in product &&
                      product.construction && (
                        <span>
                          {term(
                            product.construction
                          )}
                        </span>
                      )}
                  </div>
                </article>
              );
            }
          )}
        </div>

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {filteredProducts.length === 0 && (
          <div className="store-empty">
            <span>{dict.noProducts}</span>

            <button
              type="button"
              onClick={resetFilters}
            >
              {dict.clearFilters}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

/* ========================================================
   FILTER COMPONENT
======================================================== */

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="store-filter">
      <span>{label}</span>

      <select
        value={value}
        onChange={(event) => {
          onChange(
            event.currentTarget.value
          );
        }}
      >
        {options.map((option) => (
          <option
            key={`${label}-${option.value}`}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

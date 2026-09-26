"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import products from "./storeData.json";

import "./Store.css";

const categories = [
  "ALL",
  "WHEELS",
  "EXTERIOR",
  "PERFORMANCE",
  "ACCESSORIES",
] as const;

type Category = (typeof categories)[number];

type Product = (typeof products)[number];

type FilterConfig = {
  key:
    | "material"
    | "diameter"
    | "width"
    | "construction"
    | "finish"
    | "application"
    | "component"
    | "system"
    | "type";

  label: string;
};

const categoryFilters: Record<
  Exclude<Category, "ALL">,
  FilterConfig[]
> = {
  WHEELS: [
    {
      key: "diameter",
      label: "DIAMETER",
    },
    {
      key: "width",
      label: "WIDTH",
    },
    {
      key: "construction",
      label: "CONSTRUCTION",
    },
    {
      key: "material",
      label: "MATERIAL",
    },
    {
      key: "finish",
      label: "FINISH",
    },
    {
      key: "application",
      label: "APPLICATION",
    },
  ],

  EXTERIOR: [
    {
      key: "component",
      label: "COMPONENT",
    },
    {
      key: "material",
      label: "MATERIAL",
    },
  ],

  PERFORMANCE: [
    {
      key: "system",
      label: "SYSTEM",
    },
    {
      key: "material",
      label: "MATERIAL",
    },
  ],

  ACCESSORIES: [
    {
      key: "type",
      label: "TYPE",
    },
    {
      key: "material",
      label: "MATERIAL",
    },
  ],
};

export default function StoreCatalog() {
  const [category, setCategory] =
    useState<Category>("ALL");

  const [filters, setFilters] = useState<
    Record<string, string>
  >({});

  const [search, setSearch] = useState("");

  const activeFilters =
    category === "ALL"
      ? []
      : categoryFilters[category];

  /*
   * Category değişince o kategoriye ait
   * filtreleri sıfırla.
   */
  const changeCategory = (value: Category) => {
    setCategory(value);
    setFilters({});
  };

  /*
   * Seçili kategoriye göre filtre seçeneklerini
   * JSON içerisindeki gerçek datadan oluştur.
   */
  const filterOptions = useMemo(() => {
    const result: Record<string, string[]> = {};

    if (category === "ALL") {
      return result;
    }

    const categoryProducts = products.filter(
      (product) =>
        product.category === category
    );

    activeFilters.forEach((filter) => {
      const values = categoryProducts
        .map((product) => {
          const value =
            product[
              filter.key as keyof Product
            ];

          if (
            value === undefined ||
            value === null
          ) {
            return null;
          }

          return String(value);
        })
        .filter(
          (value): value is string =>
            value !== null
        );

      result[filter.key] = [
        "ALL",
        ...Array.from(new Set(values)),
      ];
    });

    return result;
  }, [category, activeFilters]);

  /*
   * Ürünleri filtrele.
   */
  const filteredProducts = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return products.filter((product) => {
      /*
       * Category
       */
      const matchesCategory =
        category === "ALL" ||
        product.category === category;

      if (!matchesCategory) {
        return false;
      }

      /*
       * Search
       */
      const matchesSearch =
        !searchValue ||
        product.name
          .toLowerCase()
          .includes(searchValue) ||
        product.description
          .toLowerCase()
          .includes(searchValue);

      if (!matchesSearch) {
        return false;
      }

      /*
       * Dynamic filters
       */
      for (const filter of activeFilters) {
        const selected =
          filters[filter.key];

        if (
          !selected ||
          selected === "ALL"
        ) {
          continue;
        }

        const productValue =
          product[
            filter.key as keyof Product
          ];

        if (
          String(productValue) !== selected
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    category,
    filters,
    search,
    activeFilters,
  ]);

  const resetFilters = () => {
    setCategory("ALL");
    setFilters({});
    setSearch("");
  };

  const updateFilter = (
    key: string,
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <main className="store">
      {/* HERO */}

      <section className="store-hero">
        <div className="store-meta">
          <span>03</span>
          <span>RONAS / STORE</span>
        </div>

        <div className="store-line" />

        <div className="store-hero-content">
          <span className="store-label">
            AUTOMOTIVE EQUIPMENT
          </span>

          <h1>
            BUILT
            <br />
            TO FIT.
          </h1>

          <p>
            Explore the Ronas catalog. Select a
            category, refine the specifications and
            find the equipment built for your
            vehicle.
          </p>
        </div>
      </section>

      {/* CATALOG */}

      <section className="store-catalog">
        <div className="store-filter-header">
          <div>
            <span className="store-filter-count">
              {filteredProducts.length
                .toString()
                .padStart(2, "0")}
            </span>

            <span>PRODUCTS</span>
          </div>

          <button
            type="button"
            onClick={resetFilters}
          >
            RESET FILTERS
          </button>
        </div>

        {/* FILTERS */}

        <div className="store-filters">
          {/* CATEGORY HER ZAMAN VAR */}

          <Filter
            label="CATEGORY"
            value={category}
            options={categories}
            onChange={(value) =>
              changeCategory(
                value as Category
              )
            }
          />

          {/* KATEGORİYE ÖZEL FİLTRELER */}

          {activeFilters.map((filter) => (
            <Filter
              key={filter.key}
              label={filter.label}
              value={
                filters[filter.key] ||
                "ALL"
              }
              options={
                filterOptions[filter.key] ||
                ["ALL"]
              }
              onChange={(value) =>
                updateFilter(
                  filter.key,
                  value
                )
              }
            />
          ))}

          {/* SEARCH */}

          <div className="store-search">
            <label>SEARCH</label>

            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        {/* PRODUCTS */}

        <div className="store-products">
          {filteredProducts.map(
            (product) => (
              <article
                key={product.id}
                className="store-product"
              >
                <div className="store-product-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                    className="store-product-img"
                  />

                  <span className="store-product-number">
                    {product.id
                      .slice(-2)
                      .toUpperCase()}
                  </span>
                </div>

                <div className="store-product-info">
                  <div>
                    <span className="store-product-category">
                      {product.category}
                    </span>

                    <h2>
                      {product.name}
                    </h2>
                  </div>

                  <span className="store-product-arrow">
                    ↗
                  </span>
                </div>

                <div className="store-product-specs">
                  {"diameter" in product &&
                    product.diameter && (
                      <span>
                        {product.diameter}&quot;
                      </span>
                    )}

                  {"width" in product &&
                    product.width && (
                      <span>
                        {product.width}&quot; WIDTH
                      </span>
                    )}

                  {product.material && (
                    <span>
                      {product.material}
                    </span>
                  )}

                  {"finish" in product &&
                    product.finish && (
                      <span>
                        {product.finish}
                      </span>
                    )}
                </div>
              </article>
            )
          )}
        </div>

        {/* EMPTY */}

        {filteredProducts.length === 0 && (
          <div className="store-empty">
            <span>
              NO PRODUCTS FOUND.
            </span>

            <button
              type="button"
              onClick={resetFilters}
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="store-filter">
      <span>{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

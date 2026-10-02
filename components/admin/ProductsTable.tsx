"use client";

import {
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
  Alert,
  Badge,
  Button,
  EmptyState,
  IconButton,
  Input,
  Modal,
  Panel,
  PanelHeader,
  Select,
  Switch,
  TableSkeleton,
  TableShell,
  Textarea,
} from "@/components/admin/ui";
import {
  CATEGORIES,
  SUBCATEGORIES,
  categoryLabel,
  familyOf,
  isCategorySlug,
  subcategoryLabel,
  type CategorySlug,
} from "@/lib/catalog-taxonomy";
import {
  defaultLocale,
  localeLabels,
  localeNames,
  locales,
  type Locale,
} from "@/lib/i18n";

type ProductTranslation = {
  locale: Locale;
  name: string;
  description: string;
};

type Product = {
  id: string;
  family: string;
  category: string;
  image: string | null;
  material: string | null;
  construction: string | null;
  finish: string | null;
  visible: boolean;
  translations: ProductTranslation[];
};

type DraftTranslation = { name: string; description: string };

type Draft = {
  id: string;
  family: string;
  category: string;
  image: string;
  material: string;
  construction: string;
  finish: string;
  visible: boolean;
  language: Locale;
  translations: Record<Locale, DraftTranslation>;
};

const DEFAULT_FAMILY = CATEGORIES[0].slug;

function emptyTranslations(): Record<Locale, DraftTranslation> {
  return Object.fromEntries(
    locales.map((locale) => [locale, { name: "", description: "" }]),
  ) as Record<Locale, DraftTranslation>;
}

function emptyDraft(): Draft {
  return {
    id: "",
    family: DEFAULT_FAMILY,
    category: SUBCATEGORIES[DEFAULT_FAMILY][0].slug,
    image: "",
    material: "",
    construction: "",
    finish: "",
    visible: true,
    language: defaultLocale,
    translations: emptyTranslations(),
  };
}

function draftFromProduct(product: Product): Draft {
  const translations = emptyTranslations();

  for (const translation of product.translations) {
    translations[translation.locale] = {
      name: translation.name,
      description: translation.description,
    };
  }

  const language =
    locales.find(
      (locale) =>
        translations[locale].name || translations[locale].description,
    ) ?? defaultLocale;

  return {
    id: product.id,
    family:
      familyOf(product.category) ?? product.family ?? DEFAULT_FAMILY,
    category: product.category,
    image: product.image ?? "",
    material: product.material ?? "",
    construction: product.construction ?? "",
    finish: product.finish ?? "",
    visible: product.visible,
    language,
    translations,
  };
}

/** Display name for the (English-only) admin: default locale, then any. */
function productName(product: Product): string {
  const translation =
    product.translations.find(
      (entry) => entry.locale === defaultLocale && entry.name,
    ) ?? product.translations.find((entry) => entry.name);

  return translation?.name || product.id;
}

function filledLocales(product: Product): Locale[] {
  return locales.filter((locale) =>
    product.translations.some(
      (entry) => entry.locale === locale && entry.name,
    ),
  );
}

export function ProductsTable({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">(
    "all",
  );
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [draftErrors, setDraftErrors] = useState<string[]>([]);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);

  const [removing, setRemoving] = useState<Product | null>(null);

  /* Stable identity: the modal's effect depends on it, so an inline arrow would
     re-run that effect on every keystroke and yank focus back to the trigger. */
  const closeModal = useCallback(() => setModal(null), []);

  /* The draft's family, falling back when a product predates the taxonomy. */
  const draftFamily: CategorySlug = isCategorySlug(draft.family)
    ? draft.family
    : DEFAULT_FAMILY;

  /* A stored subcategory outside the current list stays selectable so editing
     an older product never silently rewrites its category. */
  const draftSubcategories = [
    ...(SUBCATEGORIES[draftFamily].some(
      (entry) => entry.slug === draft.category,
    )
      ? []
      : [{ slug: draft.category, label: subcategoryLabel(draft.category) }]),
    ...SUBCATEGORIES[draftFamily],
  ];

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      if (filter === "visible" && !product.visible) return false;
      if (filter === "hidden" && product.visible) return false;
      if (!needle) return true;

      return [product.id, productName(product), product.family, product.category]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [products, query, filter]);

  function flash(message: string) {
    setNotice(message);
    setError("");
    setTimeout(() => setNotice(""), 4000);
  }

  function fail(message: string) {
    setError(message);
    setNotice("");
  }

  function updateTranslation(
    locale: Locale,
    patch: Partial<DraftTranslation>,
  ) {
    setDraft((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], ...patch },
      },
    }));
  }

  async function request(url: string, init: RequestInit) {
    const response = await fetch(url, init);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        Array.isArray(payload.errors) && payload.errors.length > 0
          ? payload.errors.join(" ")
          : "Request failed.";

      throw new Error(message);
    }

    return payload;
  }

  const REQUIRED = [
    ["family", "Category"],
    ["category", "Subcategory"],
    ["image", "Image URL"],
    ["material", "Material"],
    ["construction", "Construction"],
    ["finish", "Finish"],
  ] as const;

  async function save() {
    /* The products API requires every field, so catch gaps in the form
       instead of round-tripping to the server. */
    const missing: string[] = REQUIRED.filter(
      ([field]) => !draft[field].trim(),
    ).map(([, label]) => label);

    if (modal === "create" && !draft.id.trim()) {
      missing.push("Slug");
    }

    /* Product text lives per language; anything typed must be complete. */
    const filled = locales
      .map((locale) => ({ locale, ...draft.translations[locale] }))
      .filter(
        (entry) => entry.name.trim() || entry.description.trim(),
      );

    if (filled.length === 0) {
      missing.push("Name and description in at least one language");
    } else if (
      filled.some(
        (entry) => !entry.name.trim() || !entry.description.trim(),
      )
    ) {
      missing.push("Name and description for every language you filled in");
    }

    setDraftErrors(missing);

    if (missing.length > 0) return;

    const editing = modal === "edit";

    const body = {
      id: draft.id,
      family: draft.family,
      category: draft.category,
      image: draft.image,
      material: draft.material,
      construction: draft.construction,
      finish: draft.finish,
      visible: draft.visible,
      translations: filled.map((entry) => ({
        locale: entry.locale,
        name: entry.name.trim(),
        description: entry.description.trim(),
      })),
    };

    try {
      const payload = await request(
        editing ? `/api/products/${encodeURIComponent(draft.id)}` : "/api/products",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const product = (payload.product ?? payload) as Product;

      setProducts((current) =>
        editing
          ? current.map((item) => (item.id === product.id ? product : item))
          : [product, ...current],
      );

      setModal(null);
      flash(editing ? "Product updated." : "Product created.");
    } catch (err) {
      setDraftErrors([
        err instanceof Error ? err.message : "Request failed.",
      ]);
    }
  }

  async function toggleVisibility(product: Product) {
    setPendingId(product.id);
    setError("");
    setNotice("");

    try {
      const payload = await request(
        `/api/products/${encodeURIComponent(product.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visible: !product.visible }),
        },
      );

      const updated = (payload.product ?? payload) as Product;

      setProducts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      fail(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setPendingId(null);
    }
  }

  async function remove() {
    if (!removing) return;

    const id = removing.id;
    setPendingId(id);
    setError("");
    setNotice("");

    try {
      await request(`/api/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      setProducts((current) => current.filter((item) => item.id !== id));
      setRemoving(null);
      flash("Product deleted.");
    } catch (err) {
      fail(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setPendingId(null);
    }
  }

  const hiddenCount = products.filter((product) => !product.visible).length;

  return (
    <div className="space-y-4">
      <Panel>
        <PanelHeader
          title="Products"
          description={`${products.length} total · ${products.length - hiddenCount} visible · ${hiddenCount} hidden`}
          actions={
            <Button
              variant="primary"
              onClick={() => {
                setDraft(emptyDraft());
                setDraftErrors([]);
                setModal("create");
              }}
            >
              <Plus className="size-4" />
              New product
            </Button>
          }
        />

        <div className="panel-toolbar">
          <div className="relative min-w-56 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle"
              aria-hidden="true"
            />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, slug, family…"
              aria-label="Search products"
              className="control pl-9"
            />
          </div>

          <div className="segmented" role="group" aria-label="Visibility filter">
            {(["all", "visible", "hidden"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
              >
                {option === "all"
                  ? "All"
                  : option === "visible"
                    ? "Visible"
                    : "Hidden"}
              </button>
            ))}
          </div>
        </div>

        {(error || notice) && (
          <div className="px-5 pt-4">
            {error ? (
              <Alert>{error}</Alert>
            ) : (
              <Alert tone="success">{notice}</Alert>
            )}
          </div>
        )}

        {products.length === 0 ? (
          <TableSkeleton />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No products match"
            description="Adjust the search or visibility filter."
          />
        ) : (
          <TableShell head={["Product", "Languages", "Category", "Visible", ""]}>
            {visible.map((product) => {
              const name = productName(product);
              const languages = filledLocales(product);

              return (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="size-9 shrink-0 overflow-hidden rounded-md border border-line bg-sunken">
                        {product.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image}
                            alt=""
                            className="size-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="cell-strong truncate">{name}</p>

                        <p className="cell-muted truncate">
                          {categoryLabel(product.family)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="flex flex-wrap items-center gap-1">
                      {languages.length > 0 ? (
                        languages.map((locale) => (
                          <Badge key={locale}>{localeLabels[locale]}</Badge>
                        ))
                      ) : (
                        <span className="cell-muted">—</span>
                      )}
                    </div>

                    <p className="cell-muted mono mt-1 truncate">
                      {product.id}
                    </p>
                  </td>

                  <td>
                    <Badge>{subcategoryLabel(product.category)}</Badge>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.visible}
                        label={`Toggle visibility of ${name}`}
                        onChange={() => toggleVisibility(product)}
                      />

                      <span className="cell-muted">
                        {product.visible ? "Visible" : "Hidden"}
                      </span>

                      {pendingId === product.id && (
                        <span
                          className="spinner text-muted"
                          aria-label="Saving"
                        />
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="flex justify-end gap-1">
                      <IconButton
                        label={`${product.visible ? "Hide" : "Show"} ${name}`}
                        onClick={() => toggleVisibility(product)}
                        disabled={pendingId === product.id}
                      >
                        {product.visible ? (
                          <EyeOff className="size-4" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4" aria-hidden="true" />
                        )}
                      </IconButton>

                      <IconButton
                        label={`Edit ${name}`}
                        onClick={() => {
                          setDraft(draftFromProduct(product));
                          setDraftErrors([]);
                          setModal("edit");
                        }}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </IconButton>

                      <IconButton
                        label={`Delete ${name}`}
                        onClick={() => setRemoving(product)}
                      >
                        <Trash2 className="size-4 text-danger" aria-hidden="true" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </TableShell>
        )}
      </Panel>

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal === "edit" ? "Edit product" : "New product"}
        description={
          modal === "edit"
            ? draft.id
            : "Creates a visible product on the storefront."
        }
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={save}>
              {modal === "edit" ? "Save changes" : "Create product"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {draftErrors.length > 0 && <Alert>{draftErrors.join(" ")}</Alert>}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Slug"
              value={draft.id}
              disabled={modal === "edit"}
              onChange={(event) =>
                setDraft({ ...draft, id: event.target.value })
              }
              placeholder="intake-manifold"
              hint={modal === "edit" ? "Slug cannot change." : undefined}
            />

            <Select
              label="Category"
              value={draft.family}
              onChange={(event) => {
                const family = event.target.value as CategorySlug;

                /* The two fields move together: choosing a category always
                   lands on a valid subcategory of that category. */
                setDraft({
                  ...draft,
                  family,
                  category: SUBCATEGORIES[family][0].slug,
                });
              }}
            >
              {CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <Select
            label="Subcategory"
            required
            value={draft.category}
            onChange={(event) =>
              setDraft({ ...draft, category: event.target.value })
            }
          >
            {draftSubcategories.map((subcategory) => (
              <option key={subcategory.slug} value={subcategory.slug}>
                {subcategory.label}
              </option>
            ))}
          </Select>

          <div className="space-y-4 rounded-lg border border-line bg-sunken p-4">
            <div>
              <Select
                label="Language"
                value={draft.language}
                onChange={(event) =>
                  setDraft({ ...draft, language: event.target.value as Locale })
                }
              >
                {locales.map((locale) => (
                  <option key={locale} value={locale}>
                    {localeNames[locale]} ({localeLabels[locale]})
                    {draft.translations[locale].name ? " ✓" : ""}
                  </option>
                ))}
              </Select>

              <p className="field-hint mt-1">
                Product text is stored per language; fill as many as you need.
              </p>
            </div>

            <Input
              label={`Name (${localeLabels[draft.language]})`}
              required
              value={draft.translations[draft.language].name}
              onChange={(event) =>
                updateTranslation(draft.language, {
                  name: event.target.value,
                })
              }
              placeholder="Washed corduroy armchair"
            />

            <Textarea
              label={`Description (${localeLabels[draft.language]})`}
              required
              rows={3}
              value={draft.translations[draft.language].description}
              onChange={(event) =>
                updateTranslation(draft.language, {
                  description: event.target.value,
                })
              }
            />
          </div>

          <Input
            label="Image URL"
            required
            value={draft.image}
            onChange={(event) =>
              setDraft({ ...draft, image: event.target.value })
            }
            placeholder="https://…"
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Material"
              required
              value={draft.material}
              onChange={(event) =>
                setDraft({ ...draft, material: event.target.value })
              }
            />

            <Input
              label="Construction"
              required
              value={draft.construction}
              onChange={(event) =>
                setDraft({ ...draft, construction: event.target.value })
              }
            />

            <Input
              label="Finish"
              required
              value={draft.finish}
              onChange={(event) =>
                setDraft({ ...draft, finish: event.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-line bg-sunken px-3 py-2.5">
            <span className="cell-muted">
              Visible on storefront
            </span>

            <Switch
              checked={draft.visible}
              label="Visible on storefront"
              onChange={(next) => setDraft({ ...draft, visible: next })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title="Delete product"
        description={
          removing
            ? `${productName(removing)} (${removing.id})`
            : undefined
        }
        footer={
          <>
            <Button onClick={() => setRemoving(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={remove}
              disabled={pendingId === removing?.id}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="cell-muted">
          The product disappears from the storefront immediately. Past list
          items keep their quantity but lose the link to this product and
          will be shown as &quot;Product removed&quot;.
        </p>
      </Modal>
    </div>
  );
}

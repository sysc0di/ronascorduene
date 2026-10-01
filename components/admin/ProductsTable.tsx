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

type Product = {
  id: string;
  name: string;
  family: string;
  category: string;
  description: string | null;
  image: string | null;
  material: string | null;
  construction: string | null;
  finish: string | null;
  visible: boolean;
};

const CATEGORIES = [
  "BEDROOM",
  "LIVINGROOM",
  "DININGROOM",
  "OCCASIONAL",
];

const EMPTY_DRAFT = {
  id: "",
  name: "",
  family: "",
  category: "BEDROOM",
  description: "",
  image: "",
  material: "",
  construction: "",
  finish: "",
  visible: true,
};

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

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [draftErrors, setDraftErrors] = useState<string[]>([]);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);

  const [removing, setRemoving] = useState<Product | null>(null);

  /* Stable identity: the modal's effect depends on it, so an inline arrow would
     re-run that effect on every keystroke and yank focus back to the trigger. */
  const closeModal = useCallback(() => setModal(null), []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      if (filter === "visible" && !product.visible) return false;
      if (filter === "hidden" && product.visible) return false;
      if (!needle) return true;

      return [product.id, product.name, product.family, product.category]
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
    ["name", "Name"],
    ["family", "Family"],
    ["description", "Description"],
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

    setDraftErrors(missing);

    if (missing.length > 0) return;

    const body = { ...draft };
    const editing = modal === "edit";

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
                setDraft(EMPTY_DRAFT);
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
          <TableShell head={["Product", "Slug", "Category", "Visible", ""]}>
            {visible.map((product) => (
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
                      <p className="cell-strong truncate">
                        {product.name}
                      </p>

                      <p className="cell-muted truncate">
                        {product.family || "—"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="mono text-muted">{product.id}</td>

                <td>
                  <Badge>{product.category}</Badge>
                </td>

                <td>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.visible}
                      label={`Toggle visibility of ${product.name}`}
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
                      label={`${product.visible ? "Hide" : "Show"} ${product.name}`}
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
                      label={`Edit ${product.name}`}
                      onClick={() => {
                        setDraft({
                          id: product.id,
                          name: product.name,
                          family: product.family ?? "",
                          category: product.category,
                          description: product.description ?? "",
                          image: product.image ?? "",
                          material: product.material ?? "",
                          construction: product.construction ?? "",
                          finish: product.finish ?? "",
                          visible: product.visible,
                        });
                        setDraftErrors([]);
                        setModal("edit");
                      }}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </IconButton>

                    <IconButton
                      label={`Delete ${product.name}`}
                      onClick={() => setRemoving(product)}
                    >
                      <Trash2 className="size-4 text-danger" aria-hidden="true" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
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

          <Input
            label="Name"
            required
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
            placeholder="Washed corduroy armchair"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Slug"
              value={draft.id}
              disabled={modal === "edit"}
              onChange={(event) =>
                setDraft({ ...draft, id: event.target.value })
              }
              placeholder="washed-corduroy-armchair"
              hint={modal === "edit" ? "Slug cannot change." : undefined}
            />

            <Select
              label="Category"
              value={draft.category}
              onChange={(event) =>
                setDraft({ ...draft, category: event.target.value })
              }
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Family"
            required
            value={draft.family}
            onChange={(event) =>
              setDraft({ ...draft, family: event.target.value })
            }
            placeholder="Corduene"
          />

          <Textarea
            label="Description"
            required
            rows={3}
            value={draft.description}
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
          />

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
            ? `${removing.name} (${removing.id})`
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
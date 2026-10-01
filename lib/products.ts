import type { Prisma } from "@/lib/generated/prisma/client";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productFields = [
  "name",
  "family",
  "category",
  "description",
  "image",
  "material",
  "construction",
  "finish",
] as const;

export const productFilters = [
  "family",
  "category",
  "material",
  "construction",
  "finish",
] as const;

export const productOrderByFields = [
  "name",
  "family",
  "category",
  "material",
  "construction",
  "finish",
  "createdAt",
  "updatedAt",
] as const;

export type ProductPayload = {
  id?: string;
  visible?: boolean;
} & Partial<Record<(typeof productFields)[number], string>>;

export const productSelect = {
  id: true,
  name: true,
  family: true,
  category: true,
  description: true,
  image: true,
  material: true,
  construction: true,
  finish: true,
  visible: true,
  createdAt: true,
  updatedAt: true,
} as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type TextResult =
  | { ok: true; value: string | undefined }
  | { ok: false; error: string };

function readText(
  body: Record<string, unknown>,
  field: string,
  required: boolean,
): TextResult {
  const value = body[field];

  if (value === undefined || value === null) {
    return required
      ? { ok: false, error: `"${field}" is required.` }
      : { ok: true, value: undefined };
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return { ok: false, error: `"${field}" must be a non-empty string.` };
  }

  return { ok: true, value: value.trim() };
}

export function parseProductPayload(
  body: unknown,
  { partial = false }: { partial?: boolean } = {},
):
  | { data: ProductPayload; errors?: undefined }
  | { data?: undefined; errors: string[] } {
  if (!isPlainObject(body)) {
    return { errors: ["Body must be a JSON object."] };
  }

  const errors: string[] = [];
  const data: ProductPayload = {};

  if (body.id !== undefined) {
    const id = readText(body, "id", true);

    if (!id.ok) {
      errors.push(id.error);
    } else if (id.value !== undefined && !SLUG_PATTERN.test(id.value)) {
      errors.push(
        `"id" must be a slug (lowercase letters, digits and dashes).`,
      );
    } else if (id.value !== undefined) {
      data.id = id.value;
    }
  } else if (!partial) {
    errors.push('"id" is required.');
  }

  for (const field of productFields) {
    const result = readText(body, field, !partial);

    if (!result.ok) {
      errors.push(result.error);
      continue;
    }

    if (result.value !== undefined) {
      data[field] = result.value;
    }
  }

  if (body.visible !== undefined && body.visible !== null) {
    if (typeof body.visible !== "boolean") {
      errors.push('"visible" must be a boolean.');
    } else {
      data.visible = body.visible;
    }
  } else if (!partial) {
    data.visible = true;
  }

  if (errors.length > 0) {
    return { errors };
  }

  return { data };
}

export function parseProductQuery(url: URL) {
  const search = url.searchParams.get("search")?.trim();
  const where: Prisma.ProductWhereInput = {};

  for (const field of productFilters) {
    const value = url.searchParams.get(field)?.trim();

    if (value) {
      where[field] = value;
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { family: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderByParam = url.searchParams.get("orderBy")?.trim();
  const orderByField = productOrderByFields.find(
    (field) => field === orderByParam,
  );

  const orderBy: Prisma.ProductOrderByWithRelationInput = orderByField
    ? { [orderByField]: url.searchParams.get("order") === "desc" ? "desc" : "asc" }
    : { createdAt: "asc" };

  const limitParam = Number(url.searchParams.get("limit") ?? Number.NaN);
  const offsetParam = Number(url.searchParams.get("offset") ?? Number.NaN);

  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), 100)
    : 100;
  const offset = Number.isFinite(offsetParam)
    ? Math.max(Math.trunc(offsetParam), 0)
    : 0;

  return { where, orderBy, limit, offset };
}

export function badRequest(errors: string[]) {
  return Response.json({ errors }, { status: 400 });
}

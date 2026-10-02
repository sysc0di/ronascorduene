import type { Prisma } from "@/lib/generated/prisma/client";
import { locales, type Locale } from "@/lib/i18n";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productFields = [
  "family",
  "category",
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
  "family",
  "category",
  "material",
  "construction",
  "finish",
  "createdAt",
  "updatedAt",
] as const;

export type ProductTranslationPayload = {
  locale: Locale;
  name: string;
  description: string;
};

export type ProductPayload = {
  id?: string;
  visible?: boolean;
  translations?: ProductTranslationPayload[];
} & Partial<Record<(typeof productFields)[number], string>>;

export const translationSelect = {
  locale: true,
  name: true,
  description: true,
} as const;

export const productSelect = {
  id: true,
  family: true,
  category: true,
  image: true,
  material: true,
  construction: true,
  finish: true,
  visible: true,
  createdAt: true,
  updatedAt: true,
  translations: {
    orderBy: { locale: "asc" },
    select: translationSelect,
  },
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

type TranslationsResult =
  | { ok: true; value: ProductTranslationPayload[] | undefined }
  | { ok: false; error: string };

function readTranslations(value: unknown, required: boolean): TranslationsResult {
  if (value === undefined || value === null) {
    return required
      ? { ok: false, error: '"translations" is required.' }
      : { ok: true, value: undefined };
  }

  if (!Array.isArray(value) || value.length === 0) {
    return {
      ok: false,
      error: '"translations" must be a non-empty array.',
    };
  }

  if (value.length > locales.length) {
    return {
      ok: false,
      error: `"translations" must contain at most ${locales.length} entries.`,
    };
  }

  const translations: ProductTranslationPayload[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    if (!isPlainObject(entry)) {
      return { ok: false, error: "Each translation must be a JSON object." };
    }

    const { locale } = entry;

    if (typeof locale !== "string" || !locales.includes(locale as Locale)) {
      return {
        ok: false,
        error: `Translation "locale" must be one of: ${locales.join(", ")}.`,
      };
    }

    if (seen.has(locale)) {
      return {
        ok: false,
        error: `Duplicate translation for locale "${locale}".`,
      };
    }

    seen.add(locale);

    const localeName = readText(entry, "name", true);
    const localeDescription = readText(entry, "description", true);

    if (!localeName.ok) {
      return {
        ok: false,
        error: `${locale}: ${localeName.error}`,
      };
    }

    if (!localeDescription.ok) {
      return {
        ok: false,
        error: `${locale}: ${localeDescription.error}`,
      };
    }

    translations.push({
      locale: locale as Locale,
      name: localeName.value as string,
      description: localeDescription.value as string,
    });
  }

  return { ok: true, value: translations };
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

  const translations = readTranslations(body.translations, !partial);

  if (!translations.ok) {
    errors.push(translations.error);
  } else if (translations.value !== undefined) {
    data.translations = translations.value;
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
      { family: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      {
        translations: {
          some: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      },
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

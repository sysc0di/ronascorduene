import { randomUUID } from "node:crypto";

import { OrderStatus } from "@/lib/generated/prisma/enums";
import type { Prisma } from "@/lib/generated/prisma/client";
import { defaultLocale } from "@/lib/i18n";
import { pickTranslation } from "@/lib/product-text";
import { prisma } from "@/lib/prisma";

export const contactFields = [
  "email",
  "phone",
  "firstName",
  "lastName",
] as const;

export const adminStatuses = [
  OrderStatus.PROCESSING,
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
  OrderStatus.SUBMITTED,
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactField = (typeof contactFields)[number];

export type OrderPayload = Partial<Record<ContactField, string>> & {
  notes?: string;
};

export const orderInclude = {
  items: {
    orderBy: { createdAt: "asc" },
    include: {
      product: {
        select: {
          id: true,
          image: true,
          family: true,
          category: true,
          visible: true,
          translations: {
            select: { locale: true, name: true },
          },
        },
      },
    },
  },
} satisfies Prisma.OrderInclude;

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const LIST_CACHE_CONTROL = "private, no-store, max-age=0, must-revalidate";

/**
 * Liste uçları ziyaretçiye özeldir (jeton çerezde taşınır), bu yüzden
 * hiçbir önbellek tarafından saklanmamalı. Aksi hâlde tarayıcı, ilk
 * ziyaretteki boş listeyi sonraki ziyaretlerde yeniden kullanır ve
 * eklenen ürünler görünmez.
 */
export function listJson(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);

  headers.set("Cache-Control", LIST_CACHE_CONTROL);
  headers.set("Pragma", "no-cache");
  headers.append("Vary", "Cookie");

  return Response.json(data, { ...init, headers });
}

export function createToken() {
  return randomUUID();
}

export function serializeOrder(order: Prisma.OrderGetPayload<{ include: typeof orderInclude }>) {
  const items = order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    createdAt: item.createdAt,
    product: item.product
      ? {
          id: item.product.id,
          name: pickTranslation(item.product.translations, defaultLocale)?.name ?? "",
          image: item.product.image,
          family: item.product.family,
          category: item.product.category,
          visible: item.product.visible,
        }
      : null,
  }));

  return {
    id: order.id,
    email: order.email,
    phone: order.phone,
    firstName: order.firstName,
    lastName: order.lastName,
    notes: order.notes,
    status: order.status,
    submittedAt: order.submittedAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    items,
  };
}

export function parseContactPayload(
  body: unknown,
): { data: OrderPayload; errors?: undefined } | { data?: undefined; errors: string[] } {
  if (!isPlainObject(body)) {
    return { errors: ["Body must be a JSON object."] };
  }

  const errors: string[] = [];
  const data: OrderPayload = {};

  for (const field of contactFields) {
    const value = body[field];

    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`"${field}" must be a non-empty string.`);
      continue;
    }

    data[field] = value.trim();
  }

  if (body.notes !== undefined && body.notes !== null) {
    if (typeof body.notes !== "string") {
      errors.push('"notes" must be a string.');
    } else {
      data.notes = body.notes.trim();
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return { data };
}

export function validateContact(order: {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}) {
  const missing: ContactField[] = [];

  for (const field of contactFields) {
    if (!order[field] || order[field].trim().length === 0) {
      missing.push(field);
    }
  }

  const errors: string[] = missing.map(
    (field) => `"${field}" is required before submitting the list.`,
  );

  if (order.email && !EMAIL_PATTERN.test(order.email)) {
    errors.push('"email" must be a valid email address.');
  }

  if (order.phone && order.phone.replace(/\D/g, "").length < 7) {
    errors.push('"phone" must contain at least 7 digits.');
  }

  return errors;
}

export type SubmissionItem = { productId: string; quantity: number };

export type OrderSubmission = OrderPayload & {
  items: SubmissionItem[];
};

export const MAX_QUANTITY = 999;

/**
 * The storefront keeps the list in localStorage, so a submission arrives as
 * the whole list plus the contact details. Duplicated product ids are merged
 * instead of rejected, and the count of products is capped.
 */
export function parseSubmission(
  body: unknown,
): { data: OrderSubmission; errors?: undefined } | { data?: undefined; errors: string[] } {
  if (!isPlainObject(body)) {
    return { errors: ["Body must be a JSON object."] };
  }

  const errors: string[] = [];

  const contact = parseContactPayload(body);

  if (!contact.data) {
    errors.push(...contact.errors);
  }

  const merged = new Map<string, number>();
  const rawItems = body.items;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    errors.push('"items" must contain at least one product.');
  } else {
    if (rawItems.length > 100) {
      errors.push('"items" must contain at most 100 products.');
    }

    for (const entry of rawItems) {
      if (!isPlainObject(entry)) {
        errors.push("Every item must be a JSON object.");
        continue;
      }

      const productId =
        typeof entry.productId === "string" ? entry.productId.trim() : "";

      if (!productId) {
        errors.push('"productId" is required for every item.');
        continue;
      }

      const parsed = parseQuantity(entry.quantity);

      if (parsed.errors) {
        errors.push(...parsed.errors);
        continue;
      }

      const total = (merged.get(productId) ?? 0) + parsed.quantity;

      merged.set(productId, Math.min(total, MAX_QUANTITY));
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  const contactErrors = validateContact(contact.data ?? {});

  if (contactErrors.length > 0) {
    return { errors: contactErrors };
  }

  return {
    data: {
      ...contact.data,
      items: [...merged].map(([productId, quantity]) => ({
        productId,
        quantity,
      })),
    },
  };
}

/** Products that are gone or hidden must not reach the database. */
export async function findUnavailableProducts(productIds: string[]) {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, visible: true },
    select: { id: true },
  });

  const available = new Set(products.map((product) => product.id));

  return productIds.filter((productId) => !available.has(productId));
}

export function parseQuantity(
  value: unknown,
  { required = true, allowZero = false }: { required?: boolean; allowZero?: boolean } = {},
) {
  if (value === undefined || value === null) {
    return required ? { errors: ['"quantity" is required.'] } : { quantity: 1 };
  }

  const quantity = typeof value === "number" ? value : Number(value);
  const min = allowZero ? 0 : 1;

  if (!Number.isInteger(quantity) || quantity < min || quantity > 999) {
    return {
      errors: [
        `"quantity" must be an integer between ${min} and 999.`,
      ],
    };
  }

  return { quantity };
}

export function badRequest(errors: string[]) {
  return Response.json({ errors }, { status: 400 });
}

export function adminOnly(isAdmin: boolean) {
  return isAdmin
    ? null
    : Response.json({ error: "Unauthorized." }, { status: 401 });
}

export function parseOrderQuery(url: URL) {
  const status = url.searchParams.get("status")?.trim();
  const search = url.searchParams.get("search")?.trim();

  const where: Prisma.OrderWhereInput = {};

  const parsedStatus = Object.values(OrderStatus).find((value) => value === status);

  if (parsedStatus) {
    where.status = parsedStatus;
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  const limitParam = Number(url.searchParams.get("limit") ?? Number.NaN);
  const offsetParam = Number(url.searchParams.get("offset") ?? Number.NaN);

  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), 100)
    : 50;
  const offset = Number.isFinite(offsetParam)
    ? Math.max(Math.trunc(offsetParam), 0)
    : 0;

  return { where, limit, offset };
}

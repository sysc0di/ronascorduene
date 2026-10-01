import { authenticateAdmin, unauthorized } from "@/lib/admin-session";
import {
  badRequest,
  parseProductPayload,
  parseProductQuery,
  productSelect,
} from "@/lib/products";
import { prisma } from "@/lib/prisma";

import type { Prisma } from "@/lib/generated/prisma/client";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { where, orderBy, limit, offset } = parseProductQuery(url);

  const includeHidden = url.searchParams.get("includeHidden") === "true";

  if (includeHidden && !(await authenticateAdmin(request))) {
    return unauthorized();
  }

  if (!includeHidden) {
    where.visible = true;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      select: productSelect,
    }),
    prisma.product.count({ where }),
  ]);

  return Response.json({ products, total, limit, offset });
}

export async function POST(request: Request) {
  if (!(await authenticateAdmin(request))) return unauthorized();

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest(["Body must be valid JSON."]);
  }

  const { data, errors } = parseProductPayload(body);

  if (!data) return badRequest(errors);

  const payload = data as Prisma.ProductCreateInput;

  const existing = await prisma.product.findUnique({
    where: { id: payload.id },
    select: { id: true },
  });

  if (existing) {
    return Response.json(
      { errors: [`Product "${payload.id}" already exists.`] },
      { status: 409 },
    );
  }

  const product = await prisma.product.create({
    data: payload,
    select: productSelect,
  });

  return Response.json({ product }, { status: 201 });
}

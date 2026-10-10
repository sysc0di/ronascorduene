import { notifyOrderShipped } from "@/lib/email";
import { OrderStatus } from "@/lib/generated/prisma/enums";
import {
  isPlainObject,
  orderInclude,
} from "@/lib/orders";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Internal: the admin panel calls this after an order is marked as shipped.
 * The storefront owns the email templates, so it mails the customer here
 * instead of duplicating SMTP logic in the admin app. Guarded by a shared
 * secret; anything else answers 401.
 */
export async function POST(request: Request) {
  const secret = process.env.STORE_NOTIFY_SECRET;

  if (
    !secret ||
    request.headers.get("x-store-notify-secret") !== secret
  ) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { errors: ["Body must be valid JSON."] },
      { status: 400 },
    );
  }

  if (
    !isPlainObject(body) ||
    typeof body.orderId !== "string" ||
    body.orderId.trim().length === 0
  ) {
    return Response.json(
      { errors: ['"orderId" is required.'] },
      { status: 400 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    include: orderInclude,
  });

  if (!order) {
    return Response.json(
      { errors: [`Order "${body.orderId}" not found.`] },
      { status: 404 },
    );
  }

  /* The created email already went out on submission; this webhook only cares
     about the shipped transition. Retried calls are idempotent. */
  if (order.status !== OrderStatus.SHIPPED) {
    return Response.json({ ok: true, skipped: true }, { status: 200 });
  }

  if (order.shippedEmailSentAt) {
    return Response.json({ ok: true, already: true }, { status: 200 });
  }

  const sent = await notifyOrderShipped(order);

  if (sent) {
    await prisma.order.update({
      where: { id: order.id },
      data: { shippedEmailSentAt: new Date() },
    });
  }

  return Response.json({ ok: true, sent }, { status: 200 });
}
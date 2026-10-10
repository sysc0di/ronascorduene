import { createTransport } from "nodemailer";

import {
  buildCreatedMail,
  buildShippedMail,
  type OrderWithItems,
} from "@/lib/email-templates";

/** Google SMTP needs host/user/pass; a missing App Password disables emails. */
function isConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
}

async function deliver({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const fromName = process.env.MAIL_FROM_NAME || "Ronas Corduene";
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    requireTLS: process.env.SMTP_SECURE !== "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: `${fromName} <${from}>`,
    to,
    subject,
    html,
    text,
  });
}

async function sendOrderMail(
  order: OrderWithItems,
  kind: "created" | "shipped",
): Promise<boolean> {
  if (!order.email) return false;

  if (!isConfigured()) {
    console.warn(
      `[email] SMTP not configured — skipping ${kind} email for order ${order.id}.`,
    );

    return false;
  }

  const mail =
    kind === "created"
      ? buildCreatedMail(order)
      : buildShippedMail(order);

  try {
    await deliver({ to: order.email, ...mail });
    console.log(`[email] sent ${kind} email for order ${order.id}.`);

    return true;
  } catch (error) {
    console.error(`[email] ${kind} email failed for order ${order.id}.`, error);

    return false;
  }
}

/** Sent right after the storefront accepts the submitted list. */
export async function notifyOrderCreated(order: OrderWithItems) {
  await sendOrderMail(order, "created");
}

/** Sent when the admin panel marks the order as shipped. Returns whether the
 *  email was actually delivered, letting the caller record the sent timestamp
 *  only on success so a retried notify call retries the email too. */
export async function notifyOrderShipped(order: OrderWithItems) {
  return sendOrderMail(order, "shipped");
}
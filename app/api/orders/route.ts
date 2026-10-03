import { OrderStatus } from "@/lib/generated/prisma/enums";
import { LEGAL_DOCUMENT_VERSION } from "@/lib/legal";
import {
  buildItemSnapshots,
  createToken,
  findUnavailableProducts,
  listJson,
  loadProductPricing,
  orderInclude,
  parseSubmission,
  serializeOrder,
} from "@/lib/orders";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Public: a submitted list. The visitor sends the whole list that was kept in
 * localStorage together with the contact details, so there is nothing to read
 * back afterwards. Admin management lives in the separate admin app.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return listJson({ errors: ["Body must be valid JSON."] }, { status: 400 });
  }

  const { data, errors } = parseSubmission(body);

  if (!data) {
    return listJson({ errors }, { status: 422 });
  }

  const unavailable = await findUnavailableProducts(
    data.items.map((item) => item.productId),
  );

  if (unavailable.length > 0) {
    return listJson(
      {
        errors: unavailable.map(
          (productId) =>
            `"${productId}" is no longer available. Please remove it from your list.`,
        ),
      },
      { status: 422 },
    );
  }

  const {
    items,
    agreementAccepted,
    marketingConsent,
    locale,
    ...contact
  } = data;

  const products = await loadProductPricing(
    items.map((item) => item.productId),
  );
  const snapshots = buildItemSnapshots(items, products);

  const submittedAt = new Date();

  try {
    const order = await prisma.order.create({
      data: {
        ...contact,
        token: createToken(),
        status: OrderStatus.SUBMITTED,
        submittedAt,
        locale,
        distanceSalesAccepted: agreementAccepted,
        preInformationAccepted: agreementAccepted,
        agreementAcceptedAt: submittedAt,
        legalVersion: LEGAL_DOCUMENT_VERSION,
        marketingConsent,
        marketingConsentAt: marketingConsent ? submittedAt : null,
        items: {
          create: snapshots,
        },
      },
      include: orderInclude,
    });

    return listJson({ order: serializeOrder(order) }, { status: 201 });
  } catch {
    return listJson(
      { errors: ["Your list could not be sent. Please try again."] },
      { status: 503 },
    );
  }
}

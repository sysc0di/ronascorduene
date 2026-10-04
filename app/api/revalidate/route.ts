import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

/**
 * On-demand revalidation for the admin panel. The admin app runs on a separate
 * origin, so it cannot call `revalidatePath` directly — it POSTs here after a
 * save with the shared secret.
 *
 * The storefront owns this list, because only it knows its own route tree.
 * `revalidatePath` takes a *route pattern* (`/[lang]`), never a resolved URL
 * (`/en`): a concrete URL matches no route, the call silently does nothing, and
 * the edit never reaches the site. Since every page below `app/[lang]` sits
 * under the same single layout, one layout revalidation clears the lot.
 */
const LAYOUT_PATHS = ["/[lang]"] as const;

/* Metadata routes live outside the `[lang]` segment, so they need their own
   call. `/sitemap.xml` is ISR-cached, so a product edit would otherwise take up
   to an hour to disappear from it. */
const METADATA_PATHS = ["/sitemap.xml"] as const;

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return Response.json(
      { error: "Revalidation is not configured." },
      { status: 503 },
    );
  }

  const provided =
    new URL(request.url).searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret");

  if (provided !== secret) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  for (const path of LAYOUT_PATHS) {
    revalidatePath(path, "layout");
  }

  for (const path of METADATA_PATHS) {
    revalidatePath(path);
  }

  return Response.json({ revalidated: [...LAYOUT_PATHS, ...METADATA_PATHS] });
}

import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

/**
 * On-demand revalidation for the admin panel. The admin app runs on a separate
 * origin, so it cannot call `revalidatePath` directly — it POSTs here after a
 * save with the shared secret.
 */

/* Generated, cached routes that have to be rebuilt whenever content changes. */
const GENERATED_PATHS = ["/sitemap.xml"] as const;

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

  let paths: string[] = ["/"];

  try {
    const body = (await request.json()) as { paths?: unknown };

    if (
      Array.isArray(body.paths) &&
      body.paths.length > 0 &&
      body.paths.every((path) => typeof path === "string")
    ) {
      paths = body.paths as string[];
    }
  } catch {
    /* Empty or non-JSON body revalidates the whole tree. */
  }

  for (const path of paths) {
    /* `layout` covers the page plus every nested route below it, so one call
       per locale root refreshes that language's home, store and detail pages. */
    revalidatePath(path, "layout");
  }

  /* A metadata route is not below any layout, so it needs its own call. */
  for (const path of GENERATED_PATHS) {
    revalidatePath(path);
  }

  return Response.json({ revalidated: [...paths, ...GENERATED_PATHS] });
}

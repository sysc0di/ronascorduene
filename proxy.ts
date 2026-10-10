import { NextResponse, type NextRequest } from "next/server";

import { LOCALE_COOKIE, locales, negotiateLocale } from "./lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefix = locales.find(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (prefix) {
    /* Forward the matched locale so `global-not-found.tsx` — which does not
       render the `[lang]` layout and so cannot read the route param — can still
       pick the right dictionary and text direction. */
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", prefix);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const locale = negotiateLocale(
    request.headers.get("accept-language"),
    request.cookies.get(LOCALE_COOKIE)?.value,
  );

  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|admin|_next|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

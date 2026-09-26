import { NextResponse, type NextRequest } from "next/server";

import { LOCALE_COOKIE, locales, negotiateLocale } from "./lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = locales.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  const locale = negotiateLocale(
    request.headers.get("accept-language"),
    request.cookies.get(LOCALE_COOKIE)?.value,
  );

  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

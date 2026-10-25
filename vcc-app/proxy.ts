import { NextRequest, NextResponse } from "next/server";
import { isSupportedLocale } from "./app/(public)/vcc/i18n/routing";
import { createMaintenanceRedirectUrl, isInfrastructurePath, isMaintenancePath,
  parseSiteStatus, shouldRedirectToMaintenance } from "./lib/site-status";
import { SESSION_COOKIE, verifySession } from "./lib/session";

const noStore = "no-store, no-cache, must-revalidate, max-age=0";
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname === "/api/admin" || pathname.startsWith("/api/admin/");
  const isMutation = pathname.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(request.method);
  const sessionPath = pathname.startsWith("/api/auth/");
  if (isMutation) {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin && origin !== process.env.APP_URL?.replace(/\/$/, "")) {
      return NextResponse.json({ success: false, error: "Invalid origin" }, { status: 403 });
    }
  }
  if (isAdmin || isAdminApi || (isMutation && !sessionPath) || pathname === "/login") {
    const session = verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session && (isAdmin || isAdminApi || (isMutation && !sessionPath))) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": noStore } });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session && pathname === "/login") return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (isAdmin || pathname === "/login" || pathname === "/auth-success" ||
      pathname.startsWith("/auth/") || isInfrastructurePath(pathname)) return NextResponse.next();
  const savedLocale = request.cookies.get("VCC_LOCALE")?.value;
  const locale = savedLocale && isSupportedLocale(savedLocale) ? savedLocale : "id";
  const siteStatus = parseSiteStatus(process.env.SITE_STATUS);
  if ((isMaintenancePath(pathname) && request.nextUrl.search) || shouldRedirectToMaintenance(siteStatus, pathname)) {
    const response = NextResponse.redirect(createMaintenanceRedirectUrl(request.nextUrl), 307);
    response.headers.set("Cache-Control", noStore);
    return response;
  }
  const firstSegment = pathname.split("/")[1];
  if (isSupportedLocale(firstSegment) || isMaintenancePath(pathname)) {
    const activeLocale = isSupportedLocale(firstSegment) ? firstSegment : locale;
    const headers = new Headers(request.headers);
    headers.set("x-vcc-locale", activeLocale);
    headers.set("x-vcc-path", pathname);
    const response = NextResponse.next({ request: { headers } });
    if (savedLocale !== activeLocale) response.cookies.set("VCC_LOCALE", activeLocale, { maxAge: 31536000, path: "/", sameSite: "lax" });
    if (isMaintenancePath(pathname)) response.headers.set("Cache-Control", noStore);
    return response;
  }
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}
export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/((?!_next/static|_next/image|favicon.ico|images|.*\\.[a-zA-Z0-9]+$).*)"],
};

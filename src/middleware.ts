import { NextRequest, NextResponse } from "next/server";

// All admin subroutes that require authentication
const PROTECTED_PREFIX = "/admin";
const PUBLIC_PATHS = ["/admin/login"];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only intercept /admin/* routes
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const authCookie = req.cookies.get("sankalp_admin_session")?.value;
  const isAuthenticated = authCookie === "authenticated";

  // Redirect unauthenticated users away from protected admin pages
  if (!isPublicPath && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page
  if (isPublicPath && isAuthenticated) {
    const dashboardUrl = new URL("/admin/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};

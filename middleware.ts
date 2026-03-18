import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin routes that are NOT the login page
  // The route group (protected) pages resolve to /admin/* URLs
  const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
  const isAdminRoute = pathname.startsWith("/admin") && !isLoginPage;

  if (isAdminRoute) {
    const token = req.cookies.get("admin_session")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const session = await verifyToken(token);
    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all /admin routes EXCEPT login
  matcher: ["/admin", "/admin/((?!login).*)"],
};

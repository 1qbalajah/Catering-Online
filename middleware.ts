import { NextResponse, type NextRequest } from "next/server";
import { allowedRolesForPath, roleHome } from "@/lib/roles";
import { sessionCookieName, staleSessionCookieNames, verifySessionToken } from "@/lib/session";

function withSessionCleanup(request: NextRequest, response: NextResponse) {
  request.cookies.getAll().forEach((cookie) => {
    const isSessionLike = cookie.name.toLowerCase().includes("session");
    const isSupabaseAuth = cookie.name.startsWith("sb-") && cookie.name.endsWith("auth-token");

    if (cookie.name !== sessionCookieName && (isSessionLike || isSupabaseAuth)) {
      response.cookies.delete(cookie.name);
    }
  });

  staleSessionCookieNames.forEach((name) => {
    response.cookies.delete(name);
  });

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySessionToken(request.cookies.get(sessionCookieName)?.value);

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return withSessionCleanup(request, NextResponse.redirect(new URL("/", request.url)));
    }

    const allowedRoles = allowedRolesForPath(pathname);

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      return withSessionCleanup(request, NextResponse.redirect(new URL("/unauthorized", request.url)));
    }
  }

  if (pathname.startsWith("/profile") && pathname !== "/profile/orders" && !session) {
    return withSessionCleanup(request, NextResponse.redirect(new URL("/", request.url)));
  }

  if ((pathname === "/login" || pathname === "/register") && session && !request.nextUrl.searchParams.get("next")) {
    return withSessionCleanup(request, NextResponse.redirect(new URL(roleHome[session.user.role], request.url)));
  }

  return withSessionCleanup(request, NextResponse.next());
}

export const config = {
  matcher: ["/", "/paket/:path*", "/profile/:path*", "/dashboard/:path*", "/login", "/register", "/unauthorized"],
};

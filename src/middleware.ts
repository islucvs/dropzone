// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const possibleCookieNames = [
    "__Secure-next-auth.session-token",
    "next-auth.session-token",
    "__Host-next-auth.session-token",
    "authjs.session-token",
    "__Secure-authjs.session-token"
  ];
  
  let authCookie = null;
  
  // Check all possible cookie names
  for (const cookieName of possibleCookieNames) {
    const cookie = req.cookies.get(cookieName);
    if (cookie) {
      authCookie = cookie;
      break;
    }
  }
  
  const loginPage = req.nextUrl.pathname === "/";
  const dashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

  // Redirect to login if trying to access protected pages without auth
  if (!authCookie && dashboardPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect to dashboard if already authenticated and trying to access login page
  if (authCookie && loginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
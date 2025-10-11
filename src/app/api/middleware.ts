// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // 🔒 Protect /admin for admins only
    if (pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url)); // redirect staff → landing page
    }

    // 🔒 Protect /checkout (must be logged in, any role)
    if (pathname.startsWith("/checkout") && !req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // require login for protected routes
    },
  }
);

// Paths to protect
export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};

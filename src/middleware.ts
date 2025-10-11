// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/menu', '/about', '/contact', '/catering', '/signin', '/signup'];
    if (publicRoutes.includes(pathname) || pathname.startsWith('/menu/')) {
      return NextResponse.next();
    }

    // 🔒 Protect /admin for admins only
    if (pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 🔒 Protect /staff for staff/admins only
    if (pathname.startsWith("/staff") && !["ADMIN", "STAFF"].includes(req.nextauth.token?.role as string)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 🔒 Protect /checkout (must be logged in, any role)
    if (pathname.startsWith("/checkout") && !req.nextauth.token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes don't require authentication
        const publicRoutes = ['/', '/menu', '/about', '/contact', '/catering', '/signin', '/signup'];
        if (publicRoutes.includes(pathname) || pathname.startsWith('/menu/')) {
          return true;
        }
        
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/checkout/:path*", "/cart"],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that require authentication
const PROTECTED_PATHS = ["/chat", "/api/chat"];

// Paths that are only accessible to unauthenticated users
const AUTH_PATHS = ["/login"];

// Admin paths that require admin auth
const ADMIN_PATHS = ["/admin", "/api/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionId = request.cookies.get("session_id")?.value;
  const adminAuth = request.cookies.get("admin_auth")?.value;

  // Check if accessing protected paths without session
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  
  if (isProtectedPath && !sessionId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if accessing admin paths without admin auth
  const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path));
  
  if (isAdminPath && adminAuth !== "true") {
    const adminLoginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(adminLoginUrl);
  }

  // Add security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME-type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS filter (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|hero-video.mp4).*)",
  ],
};

import { NextRequest, NextResponse } from "next/server";

/**
 * Xóa session cookie hỏng/expired và redirect về login.
 * Được gọi từ chat/page.tsx khi session không còn hợp lệ.
 */
export async function GET(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);

  const response = NextResponse.redirect(loginUrl);

  // Xóa cookie session hỏng bằng cách set maxAge = 0
  response.cookies.set("session_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}

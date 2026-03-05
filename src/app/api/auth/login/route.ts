import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  checkRateLimit,
  getClientIP,
  isValidPhone,
  normalizePhone,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = await getClientIP();

    // Check rate limit
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.",
          retryAfter: rateLimit.resetIn,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetIn.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const { name, phone } = body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ tên (tối thiểu 2 ký tự)" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Vui lòng nhập số điện thoại" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    if (!isValidPhone(normalizedPhone)) {
      return NextResponse.json(
        { error: "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 số)" },
        { status: 400 }
      );
    }

    // Create session
    const result = await createSession(name.trim(), normalizedPhone);
    if (!result) {
      return NextResponse.json(
        { error: "Không thể tạo phiên đăng nhập. Vui lòng thử lại." },
        { status: 500 }
      );
    }

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        name: result.session.name,
        phone: result.session.phone,
      },
    });

    response.cookies.set("session_id", result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

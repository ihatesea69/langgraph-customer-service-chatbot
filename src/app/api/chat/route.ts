import { invokeAgent } from "@/lib/langgraph/agent";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";

// NOTE: In-memory rate limiting is best-effort on serverless.
// For production, use Vercel KV or Upstash Redis.
const rateLimitMap = new Map<
  string,
  { timestamps: number[]; lastCleanup: number }
>();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  // Validate IP and require actual IP
  if (!ip || ip === "::1" || ip === "127.0.0.1") {
    return req.headers.get("x-real-ip") || "unknown";
  }
  return ip;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { timestamps: [], lastCleanup: now };
  const recentRequests = entry.timestamps.filter(
    (time) => now - time < RATE_WINDOW
  );

  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, {
    timestamps: recentRequests,
    lastCleanup: entry.lastCleanup,
  });

  // Periodic cleanup of stale entries
  if (now - entry.lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.timestamps.every((t) => now - t > RATE_WINDOW)) {
        rateLimitMap.delete(key);
      }
    }
  }

  return true;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Vui lòng đợi một phút." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message = body.message?.trim();
    const history = body.history;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Tin nhắn không hợp lệ" },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: "Tin nhắn quá dài (tối đa 500 ký tự)" },
        { status: 400 }
      );
    }

    // Validate and sanitize history array (SEC-03)
    const MAX_HISTORY = 20;
    const MAX_CONTENT_LENGTH = 1000;
    const validatedHistory: ChatMessage[] = Array.isArray(history)
      ? history
          .slice(-MAX_HISTORY)
          .filter(
            (msg): msg is ChatMessage =>
              msg &&
              typeof msg === "object" &&
              (msg.role === "user" || msg.role === "assistant") &&
              typeof msg.content === "string"
          )
          .map((msg) => ({
            ...msg,
            content: msg.content.slice(0, MAX_CONTENT_LENGTH),
          }))
      : [];

    // Convert history to LangChain messages
    const langchainMessages = validatedHistory.map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );

    // Invoke agent
    const response = await invokeAgent(langchainMessages, message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}


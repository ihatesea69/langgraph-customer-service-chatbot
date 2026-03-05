import { getSession } from "@/lib/auth";
import { invokeAgent } from "@/lib/langgraph/agent";
import { tokenUsage } from "@/lib/token-usage";
import { conversationService } from "@/lib/conversations";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";
import { traceable } from "langsmith/traceable";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Estimate tokens (rough: 1 token ≈ 4 chars for English, 2 chars for Vietnamese)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 2);
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để sử dụng" },
        { status: 401 }
      );
    }

    const userId = session.id;

    // Check token limit
    const { allowed, remaining } = await tokenUsage.canUse(userId);
    if (!allowed) {
      return NextResponse.json(
        { 
          error: "Bạn đã hết quota hôm nay (10,000 tokens). Thử lại vào ngày mai.",
          remaining: 0 
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message = body.message?.trim();
    const conversationId = body.conversationId;
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

    // Validate history
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

    // Convert to LangChain messages
    const langchainMessages = validatedHistory.map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );

    // Invoke agent with LangSmith metadata for per-request tracing
    const tracedInvokeAgent = traceable(
      async () =>
        invokeAgent(langchainMessages, message, {
          userId,
          conversationId: conversationId ?? undefined,
        }),
      {
        name: "chat-request",
        run_type: "chain",
        tags: ["bonedoc-chatbot", "api"],
        metadata: {
          userId,
          conversationId: conversationId ?? null,
          messageLength: message.length,
          historyLength: validatedHistory.length,
        },
      }
    );

    const response = await tracedInvokeAgent();

    // Track token usage (input + output)
    const inputTokens = estimateTokens(message + validatedHistory.map(m => m.content).join(""));
    const outputTokens = estimateTokens(response);
    const totalTokens = inputTokens + outputTokens;
    await tokenUsage.addUsage(userId, totalTokens);

    // Save messages to conversation if conversationId provided
    if (conversationId) {
      await conversationService.addMessage(userId, conversationId, {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: Date.now(),
      });
      await conversationService.addMessage(userId, conversationId, {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      });
    }

    // Get updated remaining
    const updated = await tokenUsage.canUse(userId);

    return NextResponse.json({ 
      response,
      remaining: updated.remaining,
      used: totalTokens,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

// GET endpoint to check remaining tokens
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { remaining } = await tokenUsage.canUse(session.id);
    return NextResponse.json({ 
      remaining,
      limit: tokenUsage.DAILY_LIMIT,
    });
  } catch (error) {
    console.error("Token check error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

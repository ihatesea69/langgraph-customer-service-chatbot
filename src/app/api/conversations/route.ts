import { getSession } from "@/lib/auth";
import { conversationService } from "@/lib/conversations";
import { NextRequest, NextResponse } from "next/server";

// GET - List all conversations
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await conversationService.list(session.id);
  return NextResponse.json({ conversations });
}

// POST - Create new conversation
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await conversationService.create(session.id);
  return NextResponse.json({ conversation });
}

// DELETE - Delete a conversation
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const convId = searchParams.get("id");
  
  if (!convId) {
    return NextResponse.json({ error: "Missing conversation ID" }, { status: 400 });
  }

  await conversationService.delete(session.id, convId);
  return NextResponse.json({ success: true });
}

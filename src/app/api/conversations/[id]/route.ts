import { getSession } from "@/lib/auth";
import { conversationService } from "@/lib/conversations";
import { NextRequest, NextResponse } from "next/server";

// GET - Get single conversation with messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await conversationService.get(session.id, id);
  
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}

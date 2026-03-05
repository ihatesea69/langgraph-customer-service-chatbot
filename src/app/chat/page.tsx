import { getSession } from "@/lib/auth";
import ChatLayout from "@/components/ChatLayout";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ChatPage() {
  const session = await getSession();

  if (!session) {
    // Xóa cookie hỏng để tránh redirect loop
    const cookieStore = await cookies();
    cookieStore.delete("session_id");
    redirect("/login");
  }

  return <ChatLayout userName={session!.name} />;
}

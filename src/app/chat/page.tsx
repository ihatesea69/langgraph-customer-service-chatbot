import { getSession } from "@/lib/auth";
import ChatLayout from "@/components/ChatLayout";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getSession();

  if (!session) {
    // Redirect qua API để xóa cookie hỏng, tránh loop
    redirect("/api/auth/clear-session");
  }

  return <ChatLayout userName={session!.name} />;
}

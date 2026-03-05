import { getSession } from "@/lib/auth";
import ChatLayout from "@/components/ChatLayout";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <ChatLayout userName={session.name} />;
}

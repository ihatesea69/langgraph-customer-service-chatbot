import { auth } from "@/lib/auth";
import ChatLayout from "@/components/ChatLayout";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <ChatLayout />;
}

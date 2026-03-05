"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
}

interface ChatLayoutProps {
  userName: string;
}

export default function ChatLayout({ userName }: ChatLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTokens, setRemainingTokens] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch conversations list
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  // Fetch single conversation
  const fetchConversation = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.conversation?.messages || []);
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  }, []);

  // Fetch remaining tokens
  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setRemainingTokens(data.remaining);
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    fetchTokens();
  }, [fetchConversations, fetchTokens]);

  // Load conversation when activeId changes
  useEffect(() => {
    if (activeId) {
      fetchConversation(activeId);
    } else {
      setMessages([]);
    }
  }, [activeId, fetchConversation]);

  const handleNewConversation = async () => {
    try {
      const res = await fetch("/api/conversations", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setConversations((prev) => [data.conversation, ...prev]);
        setActiveId(data.conversation.id);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!confirm("Xóa cuộc hội thoại này?")) return;
    try {
      await fetch(`/api/conversations?id=${convId}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeId === convId) {
        setActiveId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    // Create conversation if none active
    let convId = activeId;
    if (!convId) {
      try {
        const res = await fetch("/api/conversations", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          convId = data.conversation.id;
          setConversations((prev) => [data.conversation, ...prev]);
          setActiveId(convId);
        } else {
          return;
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
        return;
      }
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId: convId,
          history: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error");
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setRemainingTokens(data.remaining);

      // Refresh conversations to update title
      fetchConversations();
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1));
      alert(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#282a2e] overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userName={userName}
      />
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        remainingTokens={remainingTokens}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

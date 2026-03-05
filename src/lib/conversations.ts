import { kv } from "@vercel/kv";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const CONVERSATIONS_KEY = (userId: string) => `conversations:${userId}`;
const CONVERSATION_KEY = (userId: string, convId: string) => `conv:${userId}:${convId}`;

export const conversationService = {
  // List all conversations for a user (metadata only)
  async list(userId: string): Promise<Omit<Conversation, "messages">[]> {
    const keys = await kv.smembers(CONVERSATIONS_KEY(userId));
    if (!keys.length) return [];

    const conversations: Omit<Conversation, "messages">[] = [];
    for (const id of keys) {
      const conv = await kv.get<Conversation>(CONVERSATION_KEY(userId, id as string));
      if (conv) {
        conversations.push({
          id: conv.id,
          title: conv.title,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
        });
      }
    }

    return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
  },

  // Get a single conversation with messages
  async get(userId: string, convId: string): Promise<Conversation | null> {
    return await kv.get<Conversation>(CONVERSATION_KEY(userId, convId));
  },

  // Create a new conversation
  async create(userId: string): Promise<Conversation> {
    const id = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const conversation: Conversation = {
      id,
      title: "Cuộc hội thoại mới",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await kv.set(CONVERSATION_KEY(userId, id), conversation);
    await kv.sadd(CONVERSATIONS_KEY(userId), id);

    return conversation;
  },

  // Add message to conversation
  async addMessage(userId: string, convId: string, message: Message): Promise<void> {
    const conv = await this.get(userId, convId);
    if (!conv) return;

    conv.messages.push(message);
    conv.updatedAt = Date.now();

    // Update title from first user message
    if (conv.messages.length === 1 && message.role === "user") {
      conv.title = message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "");
    }

    await kv.set(CONVERSATION_KEY(userId, convId), conv);
  },

  // Delete a conversation
  async delete(userId: string, convId: string): Promise<void> {
    await kv.del(CONVERSATION_KEY(userId, convId));
    await kv.srem(CONVERSATIONS_KEY(userId), convId);
  },

  // Update conversation title
  async updateTitle(userId: string, convId: string, title: string): Promise<void> {
    const conv = await this.get(userId, convId);
    if (!conv) return;
    
    conv.title = title;
    await kv.set(CONVERSATION_KEY(userId, convId), conv);
  },
};

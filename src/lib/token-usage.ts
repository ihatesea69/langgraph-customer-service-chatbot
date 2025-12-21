import { kv } from "@vercel/kv";

const DAILY_LIMIT = 10000; // tokens per day per user

interface TokenUsage {
  tokensUsed: number;
  lastReset: string; // ISO date string YYYY-MM-DD
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export const tokenUsage = {
  async getUsage(userId: string): Promise<TokenUsage> {
    const key = `tokens:${userId}`;
    const data = await kv.get<TokenUsage>(key);
    const today = getTodayKey();

    // Reset if new day
    if (!data || data.lastReset !== today) {
      return { tokensUsed: 0, lastReset: today };
    }

    return data;
  },

  async addUsage(userId: string, tokens: number): Promise<void> {
    const key = `tokens:${userId}`;
    const current = await this.getUsage(userId);
    
    await kv.set(key, {
      tokensUsed: current.tokensUsed + tokens,
      lastReset: getTodayKey(),
    });
  },

  async canUse(userId: string): Promise<{ allowed: boolean; remaining: number }> {
    const usage = await this.getUsage(userId);
    const remaining = DAILY_LIMIT - usage.tokensUsed;
    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
    };
  },

  DAILY_LIMIT,
};

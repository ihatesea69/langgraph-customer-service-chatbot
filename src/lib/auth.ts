import { kv } from "@vercel/kv";
import { cookies, headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const SESSION_PREFIX = "session:";
const RATE_LIMIT_PREFIX = "ratelimit:";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days
const RATE_LIMIT_WINDOW = 60; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 login attempts per minute per IP

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  createdAt: number;
  lastActivity: number;
}

/**
 * Normalize Vietnamese phone number to standard format
 * Accepts: 0901234567, 84901234567, +84901234567
 * Returns: 84901234567
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  
  if (cleaned.startsWith("+84")) {
    return cleaned.slice(1);
  }
  if (cleaned.startsWith("84") && cleaned.length === 11) {
    return cleaned;
  }
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return "84" + cleaned.slice(1);
  }
  
  return cleaned;
}

/**
 * Validate Vietnamese phone number format
 */
export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // Vietnamese phone: 84 + 9 digits (total 11 digits)
  return /^84\d{9}$/.test(normalized);
}

/**
 * Get client IP address from headers
 */
export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

/**
 * Check rate limit for login attempts
 * Returns true if request is allowed, false if rate limited
 */
export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const key = `${RATE_LIMIT_PREFIX}login:${ip}`;
  
  try {
    const current = await kv.get<number>(key);
    
    if (current === null) {
      await kv.set(key, 1, { ex: RATE_LIMIT_WINDOW });
      return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW };
    }
    
    if (current >= MAX_REQUESTS_PER_WINDOW) {
      const ttl = await kv.ttl(key);
      return { allowed: false, remaining: 0, resetIn: ttl > 0 ? ttl : RATE_LIMIT_WINDOW };
    }
    
    await kv.incr(key);
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - current - 1, resetIn: RATE_LIMIT_WINDOW };
  } catch {
    // If KV fails, allow the request but log the error
    console.error("Rate limit check failed, allowing request");
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW, resetIn: RATE_LIMIT_WINDOW };
  }
}

/**
 * Create a new user session
 */
export async function createSession(name: string, phone: string): Promise<{ session: UserSession; sessionId: string } | null> {
  const normalizedPhone = normalizePhone(phone);
  
  if (!isValidPhone(normalizedPhone)) {
    return null;
  }
  
  const sessionId = uuidv4();
  const session: UserSession = {
    id: sessionId,
    name: name.trim(),
    phone: normalizedPhone,
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };
  
  try {
    await kv.set(`${SESSION_PREFIX}${sessionId}`, session, { ex: SESSION_TTL });
    return { session, sessionId };
  } catch (error) {
    console.error("Failed to create session:", error);
    return null;
  }
}

/**
 * Validate and get session by ID
 */
export async function validateSession(sessionId: string): Promise<UserSession | null> {
  if (!sessionId) return null;
  
  try {
    const session = await kv.get<UserSession>(`${SESSION_PREFIX}${sessionId}`);
    
    if (!session) return null;
    
    // Update last activity
    session.lastActivity = Date.now();
    await kv.set(`${SESSION_PREFIX}${sessionId}`, session, { ex: SESSION_TTL });
    
    return session;
  } catch (error) {
    console.error("Failed to validate session:", error);
    return null;
  }
}

/**
 * Get current session from cookies
 */
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  
  if (!sessionId) return null;
  
  return validateSession(sessionId);
}

/**
 * Delete session (logout)
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    await kv.del(`${SESSION_PREFIX}${sessionId}`);
    return true;
  } catch (error) {
    console.error("Failed to delete session:", error);
    return false;
  }
}

/**
 * Check if request is from admin (using password)
 */
export function isValidAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn("ADMIN_PASSWORD not set in environment");
    return false;
  }
  return password === adminPassword;
}

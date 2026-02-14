// ==========================================================
// HisabDesk — AI Rate Limiter (Abuse Protection)
// ----------------------------------------------------------
// PURPOSE
//   Prevents AI spam / accidental loops / runaway costs
//
//   Complements:
//     ✓ budgetEnforcer  → monthly $ protection
//     ✓ rateLimiter     → short-term burst protection
//
//   Protects against:
//     ❌ 100 requests in 1 second
//     ❌ infinite loops
//     ❌ UI bugs spamming AI
//
//   Strategy:
//     Per-user sliding window (DB backed)
//
//   Default:
//     20 requests / minute / user
//
//   Used by:
//     ✓ safeRun.ts (before every AI call)
//
//   RULE:
//     Always call checkRateLimit() before OpenAI
//
// ==========================================================

import { createClient } from "@/lib/supabase"

// ==========================================================
// CONFIG
// ==========================================================

const WINDOW_SECONDS = 60
const MAX_REQUESTS = 20

// ==========================================================
// CLIENT
// ==========================================================

const supabase = createClient()

// ==========================================================
// TYPES
// ==========================================================

export interface RateLimitStatus {
  allowed: boolean
  remaining: number
  resetInSeconds: number
}

// ==========================================================
// CORE
// ==========================================================

export async function checkRateLimit(
  userId: string
): Promise<RateLimitStatus> {
  const now = Date.now()
  const windowStart = new Date(
    now - WINDOW_SECONDS * 1000
  ).toISOString()

  // --------------------------------------------------------
  // count recent requests from ai_logs
  // (cheap — we already log every AI call)
  // --------------------------------------------------------

  const { data } = await supabase
    .from("ai_logs")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", windowStart)

  const count = data?.length || 0

  const remaining = Math.max(0, MAX_REQUESTS - count)

  return {
    allowed: count < MAX_REQUESTS,
    remaining,
    resetInSeconds: WINDOW_SECONDS,
  }
}

// ==========================================================
// ENFORCER
// ==========================================================

export async function enforceRateLimit(userId: string) {
  const status = await checkRateLimit(userId)

  if (!status.allowed) {
    throw new Error(
      "Too many AI requests. Please wait a minute."
    )
  }

  return status
}

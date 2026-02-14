// ==========================================================
// HisabDesk — Security Guards
//
// PURPOSE
// Central reusable auth/security helpers for:
//
// - API routes
// - server actions
// - cron protection
//
// WHY
// Avoid duplicating:
//   const { user } = await supabase.auth.getUser()
//
// Single source of truth for:
// - auth checks
// - cron secret validation
// - basic rate limiting hooks (future)
//
// RULES
// ✅ server only
// ✅ lightweight
// ❌ no business logic
// ❌ no UI
// ❌ no calculations
// ==========================================================

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

/* =========================================================
Types
========================================================= */

export interface GuardUser {
  id: string
  email?: string
}

/* =========================================================
Auth Guard
========================================================= */

/**
 * Ensures request has authenticated Supabase user
 *
 * Usage:
 * const user = await requireUser()
 */
export async function requireUser(): Promise<GuardUser> {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Unauthorized")
  }

  return {
    id: user.id,
    email: user.email ?? undefined,
  }
}

/* =========================================================
Optional Guard (no throw)
========================================================= */

/**
 * Returns user or null
 */
export async function getOptionalUser(): Promise<GuardUser | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  return {
    id: user.id,
    email: user.email ?? undefined,
  }
}

/* =========================================================
Cron Guard
========================================================= */

/**
 * Validates cron secret header
 *
 * Usage:
 * requireCron(req)
 */
export function requireCron(req: NextRequest): void {
  const secret = req.headers.get("x-cron-secret")

  if (!secret || secret !== process.env.CRON_SECRET) {
    throw new Error("Unauthorized cron access")
  }
}

/* =========================================================
Basic IP Rate Limit Key (future use)
========================================================= */

/**
 * Utility to build simple rate-limit key
 * (for future redis/kv integration)
 */
export function getIPKey(req: NextRequest): string {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown"

  return `ip:${ip}`
}

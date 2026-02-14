/**
 * =========================================================
 * Request Logger (Enterprise API Audit Middleware)
 * HisabDesk – Security + Observability
 * =========================================================
 *
 * PURPOSE
 * Log ALL important API calls:
 *
 *   ✓ auth attempts
 *   ✓ billing actions
 *   ✓ admin operations
 *   ✓ webhooks
 *   ✓ exports/backups
 *
 * WHY (Enterprise MUST)
 *   Needed for:
 *     ✓ forensic debugging
 *     ✓ fraud detection
 *     ✓ compliance
 *     ✓ audit trails
 *
 * DIFFERENT FROM activity_logs
 *   activity_logs  → business actions (expense added)
 *   request_logs   → system/API calls (who hit which API)
 *
 * SAFE
 * - server only
 * - no existing files modified
 *
 * =========================================================
 *
 * REQUIRED TABLE (Supabase SQL)
 *
 * create table request_logs (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid,
 *   method text,
 *   path text,
 *   ip text,
 *   status int,
 *   latency int,
 *   meta jsonb,
 *   created_at timestamp default now()
 * );
 *
 * =========================================================
 *
 * USAGE (API route)
 *
 * const start = Date.now()
 *
 * const res = await handler()
 *
 * await logRequest({
 *   req,
 *   userId,
 *   status: 200,
 *   start
 * })
 *
 * =========================================================
 */

"use server"

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   CLIENT
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   TYPES
========================================================= */

type LogInput = {
  req: Request
  userId?: string | null
  status: number
  start: number
  meta?: Record<string, any>
}

/* =========================================================
   IP HELPER
========================================================= */

function getIP(req: Request) {
  return (
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

/* =========================================================
   CORE LOGGER
========================================================= */

export async function logRequest(input: LogInput) {
  try {
    const supabase = getClient()

    const latency = Date.now() - input.start
    const url = new URL(input.req.url)

    await supabase.from("request_logs").insert({
      user_id: input.userId ?? null,
      method: input.req.method,
      path: url.pathname,
      ip: getIP(input.req),
      status: input.status,
      latency,
      meta: input.meta ?? {},
    })
  } catch {
    /* logging must never break request */
  }
}

/* =========================================================
   WRAPPER HELPER (auto measure)
========================================================= */

export async function withRequestLog<T>(
  req: Request,
  userId: string | null,
  handler: () => Promise<T>,
  meta?: any
): Promise<T> {
  const start = Date.now()

  try {
    const result = await handler()

    await logRequest({
      req,
      userId,
      status: 200,
      start,
      meta,
    })

    return result
  } catch (err) {
    await logRequest({
      req,
      userId,
      status: 500,
      start,
      meta: { error: true },
    })

    throw err
  }
}

/**
 * =========================================================
 * API Rate Limit Guard (Enterprise Protection)
 * HisabDesk – Abuse & Cost Control Layer
 * =========================================================
 *
 * PURPOSE
 * Protect APIs from:
 *
 *   ✓ brute force attacks
 *   ✓ webhook spam
 *   ✓ scraping
 *   ✓ accidental infinite loops
 *   ✓ cost explosion (Supabase usage)
 *
 * WHY THIS FILE EXISTS
 * ---------------------------------------------------------
 * middleware.ts → global limit (coarse)
 * THIS FILE     → per-route precise limit (fine-grained)
 *
 * Example:
 *   login → 10/min
 *   webhooks → 300/min
 *   exports → 5/min
 *
 * =========================================================
 *
 * ========================
 * USAGE (inside API route)
 * ========================
 *
 * import { rateLimitGuard } from "@/lib/security/api-rate-limit"
 *
 * await rateLimitGuard(req, {
 *   key: "login",
 *   limit: 10,
 *   windowMs: 60_000
 * })
 *
 * =========================================================
 */

"use server"

import { NextResponse } from "next/server"

/* =========================================================
   MEMORY STORE (Edge safe)
========================================================= */

type Bucket = {
  count: number
  ts: number
}

const store = new Map<string, Bucket>()

/* =========================================================
   HELPERS
========================================================= */

function getIP(req: Request) {
  return (
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

/* =========================================================
   MAIN GUARD
========================================================= */

type Options = {
  key: string // route name (login/export/webhook)
  limit: number // max requests
  windowMs: number // time window
}

export async function rateLimitGuard(
  req: Request,
  options: Options
) {
  const ip = getIP(req)

  const now = Date.now()

  const bucketKey = `${options.key}:${ip}`

  const bucket = store.get(bucketKey)

  /* ------------------------------------------------------
     NEW WINDOW
  ------------------------------------------------------ */

  if (!bucket || now - bucket.ts > options.windowMs) {
    store.set(bucketKey, {
      count: 1,
      ts: now,
    })
    return
  }

  /* ------------------------------------------------------
     LIMIT EXCEEDED
  ------------------------------------------------------ */

  if (bucket.count >= options.limit) {
    throw NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    )
  }

  /* ------------------------------------------------------
     INCREMENT
  ------------------------------------------------------ */

  bucket.count++
}

/* =========================================================
   WRAPPER (cleaner usage)
========================================================= */

export function withRateLimit(
  handler: (req: Request, ctx: any) => Promise<Response>,
  options: Options
) {
  return async (req: Request, ctx: any) => {
    await rateLimitGuard(req, options)
    return handler(req, ctx)
  }
}

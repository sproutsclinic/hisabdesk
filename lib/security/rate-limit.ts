/**
 * =========================================================
 * Enterprise Rate Limiter (API / Webhook Protection)
 * HisabDesk – Security Layer
 * =========================================================
 *
 * PURE UTILITY MODULE
 * ⚠ DO NOT add "use server" or "use client"
 * Must stay directive-free for Next 16 compatibility
 * =========================================================
 */

/* =========================================================
   TYPES
========================================================= */

type Options = {
  limit: number // requests allowed
  windowMs: number // time window
}

/* =========================================================
   MEMORY STORE
========================================================= */

type Entry = {
  count: number
  expires: number
}

const store = new Map<string, Entry>()

/* =========================================================
   FACTORY
========================================================= */

export function rateLimit(options: Options) {
  const { limit, windowMs } = options

  function check(key: string) {
    const now = Date.now()

    const existing = store.get(key)

    /* reset if expired */
    if (!existing || existing.expires < now) {
      store.set(key, {
        count: 1,
        expires: now + windowMs,
      })
      return true
    }

    /* block */
    if (existing.count >= limit) {
      return false
    }

    /* increment */
    existing.count += 1
    return true
  }

  return { check }
}

/* =========================================================
   GLOBAL PRESETS (recommended)
========================================================= */

export const webhookLimiter = rateLimit({
  limit: 60,
  windowMs: 60_000,
})

export const authLimiter = rateLimit({
  limit: 10,
  windowMs: 60_000,
})

export const apiLimiter = rateLimit({
  limit: 120,
  windowMs: 60_000,
})

/* =========================================================
   HELPER: GET IP
========================================================= */

export function getIP(req: Request) {
  return (
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "anonymous"
  )
}

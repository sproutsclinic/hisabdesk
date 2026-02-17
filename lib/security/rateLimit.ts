ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Lightweight Rate Limiter
   ========================================================= */

type Bucket = {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

const WINDOW_MS = 60000
const MAX_REQUESTS = 60

export function rateLimit(key: string) {
  const now = Date.now()

  const existing = store.get(key)

  if (!existing || now > existing.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    })

    return { allowed: true }
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  existing.count++
  return { allowed: true }
}

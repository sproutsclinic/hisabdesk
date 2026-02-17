ï»¿/**
 * =========================================================
 * API Error Handler (Enterprise Safe Responses)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Production Stability Layer
 * =========================================================
 *
 * PURPOSE
 * Standardize ALL API responses:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ never leak stack traces
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ consistent JSON format
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ safe error messages
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ automatic try/catch
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ clean handler code
 *
 * WHY IMPORTANT
 * Without this:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ random crashes
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ inconsistent responses
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ exposed internal errors
 *
 * With this:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ always safe
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ predictable structure
 *
 * =========================================================
 *
 * USAGE
 *
 * import { withErrorHandler } from "@/lib/security/api-error-handler"
 *
 * export const POST = withErrorHandler(async (req) => {
 *   return ok({ success: true })
 * })
 *
 * =========================================================
 */

"use server"

import { NextResponse } from "next/server"

/* =========================================================
   RESPONSE HELPERS
========================================================= */

export function ok(data: any, status = 200) {
  return NextResponse.json(
    { ok: true, data },
    { status }
  )
}

export function fail(
  message: string,
  status = 400
) {
  return NextResponse.json(
    { ok: false, error: message },
    { status }
  )
}

/* =========================================================
   ERROR WRAPPER
========================================================= */

type Handler = (
  req: Request,
  ctx?: any,
  user?: any
) => Promise<Response>

export function withErrorHandler(handler: Handler) {
  return async function wrapped(
    req: Request,
    ctx?: any,
    user?: any
  ): Promise<Response> {
    try {
      return await handler(req, ctx, user)
    } catch (err: any) {
      /* --------------------------------------------------
         SAFE LOG ONLY (never expose)
      -------------------------------------------------- */

      console.error("API Error:", err)

      /* --------------------------------------------------
         CLIENT SAFE RESPONSE
      -------------------------------------------------- */

      return NextResponse.json(
        {
          ok: false,
          error: "Something went wrong",
        },
        { status: 500 }
      )
    }
  }
}

/* =========================================================
   COMBINED WRAPPER (common usage)
   rate limit + audit + error
========================================================= */

import { withAudit } from "@/lib/security/api-audit-wrapper"
import { withRateLimit } from "@/lib/security/api-rate-limit"

type CombinedOptions = {
  rateLimit?: {
    key: string
    limit: number
    windowMs: number
  }
  audit?: boolean
}

/**
 * Example:
 *
 * export const POST = secureApi(handler, {
 *   rateLimit: { key: "login", limit: 10, windowMs: 60000 },
 *   audit: true
 * })
 */

export function secureApi(
  handler: Handler,
  options?: CombinedOptions
) {
  let wrapped: any = handler

  /* error wrapper ALWAYS first */
  wrapped = withErrorHandler(wrapped)

  /* audit */
  if (options?.audit) {
    wrapped = withAudit(wrapped)
  }

  /* rate limit */
  if (options?.rateLimit) {
    wrapped = withRateLimit(
      wrapped,
      options.rateLimit
    )
  }

  return wrapped
}

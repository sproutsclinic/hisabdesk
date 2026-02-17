ï»¿/**
 * =========================================================
 * API Audit Wrapper (Auto Logging for ALL APIs)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Enterprise Observability Layer
 * =========================================================
 *
 * PURPOSE
 * Automatically logs every API request:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ who called
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ which route
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ method
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ status
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ latency
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ IP
 *
 * CONNECTS TO
 *   lib/security/request-logger.ts   (already created earlier)
 *
 * WHY IMPORTANT
 * You should NEVER manually log inside every route.
 *
 * Instead wrap:
 *
 *   export const GET = withAudit(async (req, ctx, user) => { ... })
 *
 * This gives:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ clean code
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ zero duplication
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ guaranteed audit coverage
 *
 * SAFE
 * - server only
 * - does NOT modify existing routes
 *
 * =========================================================
 *
 * =========================
 * HOW TO USE (example)
 * =========================
 *
 * import { withAudit } from "@/lib/security/api-audit-wrapper"
 *
 * export const POST = withAudit(async (req, ctx, user) => {
 *   return NextResponse.json({ ok: true })
 * })
 *
 * =========================================================
 */

"use server"

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { NextResponse } from "next/server"
import { logRequest } from "@/lib/security/request-logger"

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
   GET USER FROM TOKEN
========================================================= */

async function getUserFromRequest(req: Request) {
  const supabase = getClient()

  const authHeader = req.headers.get("authorization")

  if (!authHeader) return null

  const token = authHeader.replace("Bearer ", "")

  const {
    data: { user },
  } = await supabase.auth.getUser(token)

  return user || null
}

/* =========================================================
   MAIN WRAPPER
========================================================= */

type Handler = (
  req: Request,
  ctx: any,
  user: any | null
) => Promise<Response>

export function withAudit(handler: Handler) {
  return async function audited(
    req: Request,
    ctx: any
  ): Promise<Response> {
    const start = Date.now()

    let user: any | null = null
    let status = 200

    try {
      user = await getUserFromRequest(req)

      const res = await handler(req, ctx, user)

      status = res.status

      await logRequest({
        req,
        userId: user?.id || null,
        status,
        start,
      })

      return res
    } catch (err: any) {
      status = 500

      await logRequest({
        req,
        userId: user?.id || null,
        status,
        start,
        meta: { error: true },
      })

      return NextResponse.json(
        { error: "Internal error" },
        { status: 500 }
      )
    }
  }
}

/* =========================================================
   LIGHT VERSION (no auth lookup, faster)
   Useful for public webhooks
========================================================= */

export function withAuditLight(handler: Handler) {
  return async function audited(
    req: Request,
    ctx: any
  ): Promise<Response> {
    const start = Date.now()

    try {
      const res = await handler(req, ctx, null)

      await logRequest({
        req,
        userId: null,
        status: res.status,
        start,
      })

      return res
    } catch {
      await logRequest({
        req,
        userId: null,
        status: 500,
        start,
      })

      return NextResponse.json(
        { error: "Internal error" },
        { status: 500 }
      )
    }
  }
}

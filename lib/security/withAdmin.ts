import { NextRequest, NextResponse } from "next/server"
import { requireAdminRoute } from "./requireAdmin"
import { withRateLimit } from "./withRateLimit"

/*
  PHASE 17 — Secure Admin Wrapper (All-in-one)

  Combines:
  ✓ Rate limit
  ✓ Admin auth guard

  Usage:

  export const GET = withAdmin(async (req, user) => {
     ...
  })
*/

export function withAdmin(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return withRateLimit(
    requireAdminRoute(async (req, user) => {
      return handler(req, user)
    })
  )
}

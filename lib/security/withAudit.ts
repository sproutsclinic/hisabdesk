import { NextRequest, NextResponse } from "next/server"
import { logAudit } from "./auditLog"
import { createClient } from "@supabase/supabase-js"

/*
  Wrapper for API routes to automatically log actions

  Usage:

  export const POST = withAudit("payment_success", async (req) => {
     ...
  })
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export function withAudit(
  action: string,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    let userId: string | null = null

    try {
      const authHeader = req.headers.get("authorization")

      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "")
        const {
          data: { user },
        } = await supabase.auth.getUser(token)

        userId = user?.id ?? null
      }
    } catch {}

    const response = await handler(req)

    await logAudit(action, userId)

    return response
  }
}

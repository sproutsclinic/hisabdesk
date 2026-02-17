ï»¿import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { hasRole, Role } from "./permissions"

/*
  PHASE 17 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Admin Guard (API protection)

  Usage:

  export const GET = requireAdminRoute(async (req, user) => {
     ...
  })
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export function requireAdminRoute(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("authorization")

      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const token = authHeader.replace("Bearer ", "")

      const {
        data: { user },
      } = await supabase.auth.getUser(token)

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // expects role stored in user_metadata.role
      const role = (user.user_metadata?.role || "user") as Role

      if (!hasRole(role, "admin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      return handler(req, user)
    } catch (err) {
      console.error(err)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }
}

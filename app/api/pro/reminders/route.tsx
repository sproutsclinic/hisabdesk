import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   PRO EXPIRY REMINDER ENGINE — FINAL

   GET /api/pro/reminders

   Returns:
   [
     {
       type: "expiry",
       daysLeft: number
     }
   ]

   Improvements:
   ✅ adds "type" (future multiple reminders support)
   ✅ never returns negative days
   ✅ only shows 0–7 days
   ✅ safer auth handling
   ✅ dashboard ready

================================================= */

export async function GET(req: Request) {
  try {
    /* ================= AUTH ================= */

    const authHeader = req.headers.get("authorization")

    if (!authHeader) return NextResponse.json([])

    const token = authHeader.replace("Bearer ", "")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) return NextResponse.json([])

    /* ================= PROFILE ================= */

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_pro, pro_expires_at")
      .eq("id", user.id)
      .single()

    if (!profile?.is_pro || !profile?.pro_expires_at) {
      return NextResponse.json([])
    }

    /* ================= CALC ================= */

    const expiry = new Date(profile.pro_expires_at)
    const today = new Date()

    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    /* only show between 0–7 days */
    if (diffDays >= 0 && diffDays <= 7) {
      return NextResponse.json([
        {
          type: "expiry",
          daysLeft: diffDays,
        },
      ])
    }

    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}

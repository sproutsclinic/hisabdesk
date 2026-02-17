ï»¿/* =========================================================
   Income AutoSave Suggestion API
   ---------------------------------------------------------
   âœ“ calculates suggested saving amount
   âœ“ server only
   âœ“ no AI
========================================================= */

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  /* ---------------- totals ---------------- */

  const { data: rows } = await supabase
    .from("income")
    .select("amount")
    .eq("user_id", user.id)

  const total =
    rows?.reduce((s, r) => s + Number(r.amount || 0), 0) || 0

  /* ---------------- rule (default 20%) ---------------- */

  const rate = 0.2
  const suggested = Math.round(total * rate)

  return NextResponse.json({
    data: {
      total,
      rate,
      suggested,
    },
  })
}

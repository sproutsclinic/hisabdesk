/* =========================================================
   Income AutoSave Suggestion API
   ---------------------------------------------------------
   ✓ calculates suggested saving amount
   ✓ server only
   ✓ no AI
========================================================= */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createClient()

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

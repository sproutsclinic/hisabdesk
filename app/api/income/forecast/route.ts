/* =========================================================
   Income Forecast API
   ---------------------------------------------------------
   ✓ predicts next 3 months
   ✓ simple trend line
   ✓ server only
========================================================= */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/* ========================================================= */

function monthKey(date: Date) {
  return date.toISOString().slice(0, 7)
}

/* ========================================================= */

export async function GET() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  /* ---------------- fetch last 6 months ---------------- */

  const { data: rows } = await supabase
    .from("income")
    .select("amount,date")
    .eq("user_id", user.id)

  const months: Record<string, number> = {}

  for (const r of rows || []) {
    const m = monthKey(new Date(r.date))
    months[m] = (months[m] || 0) + Number(r.amount)
  }

  const values = Object.values(months).slice(-6)

  if (values.length === 0) {
    return NextResponse.json({ data: [] })
  }

  /* ---------------- simple linear growth ---------------- */

  const avg =
    values.reduce((s, v) => s + v, 0) / values.length

  const growth =
    values.length > 1
      ? (values[values.length - 1] - values[0]) / values.length
      : 0

  const forecast = [1, 2, 3].map((i) =>
    Math.max(0, Math.round(avg + growth * i))
  )

  return NextResponse.json({
    data: forecast,
  })
}

ï»¿/* =========================================================
   Income Goals API
   ---------------------------------------------------------
   âœ“ monthly target
   âœ“ progress calc
   âœ“ KPI metrics
   âœ“ server side only
========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

/* ========================================================= */

function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7)
}

/* =========================================================
   GET â†’ fetch goal + metrics
========================================================= */

export async function GET() {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const month = monthKey()

  /* ---------------- income rows ---------------- */

  const { data: rows } = await supabase
    .from("income")
    .select("amount,date")
    .eq("user_id", user.id)

  const currentMonthRows =
    rows?.filter((r) => r.date.startsWith(month)) ?? []

  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const lastKey = monthKey(lastMonth)

  const lastRows =
    rows?.filter((r) => r.date.startsWith(lastKey)) ?? []

  const thisTotal = currentMonthRows.reduce(
    (s, r) => s + Number(r.amount),
    0
  )

  const lastTotal = lastRows.reduce(
    (s, r) => s + Number(r.amount),
    0
  )

  /* ---------------- goal ---------------- */

  const { data: goalRow } = await supabase
    .from("income_goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", month)
    .maybeSingle()

  const target = goalRow?.target ?? 0

  /* ---------------- metrics ---------------- */

  const progress = target ? (thisTotal / target) * 100 : 0
  const growth = lastTotal
    ? ((thisTotal - lastTotal) / lastTotal) * 100
    : 0

  return NextResponse.json({
    data: {
      target,
      thisTotal,
      lastTotal,
      progress: Math.round(progress),
      growth: Math.round(growth),
    },
  })
}

/* =========================================================
   POST â†’ set goal
========================================================= */

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { target } = await req.json()

  const month = monthKey()

  await supabase.from("income_goals").upsert({
    user_id: user.id,
    month,
    target,
  })

  return NextResponse.json({ success: true })
}

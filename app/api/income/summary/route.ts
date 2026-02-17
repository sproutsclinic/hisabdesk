ï»¿/* =========================================================
   HisabDesk â€“ Income Summary API
   ---------------------------------------------------------
   PURPOSE
   - monthly aggregation
   - category totals
   - used for charts + filters
   - ZERO business logic in UI
========================================================= */

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status })
}

function monthKey(date: string) {
  return date.slice(0, 7)
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) return bad("Unauthorized", 401)

    const { data: rows } = await supabase
      .from("income")
      .select("amount, date, category")
      .eq("user_id", user.id)
      .order("date")

    const monthMap: Record<string, number> = {}
    const catMap: Record<string, number> = {}

    for (const r of rows || []) {
      const m = monthKey(r.date)

      monthMap[m] = (monthMap[m] || 0) + Number(r.amount)

      const top = r.category.split("/")[0].trim()
      catMap[top] = (catMap[top] || 0) + Number(r.amount)
    }

    const monthly = Object.entries(monthMap).map(([month, total]) => ({
      month,
      total,
    }))

    const categories = Object.entries(catMap).map(([name, total]) => ({
      name,
      total,
    }))

    return NextResponse.json({
      success: true,
      data: { monthly, categories },
    })
  } catch {
    return bad("Failed", 500)
  }
}

ï»¿// ==========================================================
// HisabDesk â€” Dashboard Burn Rate API
// ==========================================================

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

const supabase = getSupabaseAdmin()

// ==========================================================
// AUTH
// ==========================================================

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return user
}

// ==========================================================
// HELPERS
// ==========================================================

function monthKey(date: string | Date) {
  const d = new Date(date)
  const m = String(d.getMonth() + 1).padStart(2, "0")
  return `${d.getFullYear()}-${m}`
}

// ==========================================================
// GET
// ==========================================================

export async function GET() {
  try {
    const user = await getUser()

    const { data } = await supabase
      .from("transactions")
      .select("amount,type,date")
      .eq("user_id", user.id)

    const tx = data || []

    const nowKey = monthKey(new Date())

    let income = 0
    let expense = 0

    for (const t of tx) {
      if (monthKey(t.date) !== nowKey) continue

      const amt = Number(t.amount)

      if (t.type === "income") income += amt
      else expense += amt
    }

    const burnRate =
      income > 0
        ? Math.round((expense / income) * 100)
        : 100

    const runwayMonths =
      expense > 0
        ? Math.round((income - expense) / expense)
        : 0

    return NextResponse.json({
      monthlyIncome: income,
      monthlyExpense: expense,
      burnRate,
      runwayMonths: Math.max(0, runwayMonths),
    })
  } catch {
    return NextResponse.json({
      monthlyIncome: 0,
      monthlyExpense: 0,
      burnRate: 0,
      runwayMonths: 0,
    })
  }
}

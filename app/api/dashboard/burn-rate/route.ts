// ==========================================================
// HisabDesk — Dashboard Burn Rate API
// ----------------------------------------------------------
// PURPOSE
//   Calculates spending burn metrics
//
//   Returns:
//     ✓ burnRate (%)      → expense / income
//     ✓ monthlyExpense
//     ✓ monthlyIncome
//     ✓ runwayMonths      → how long savings last
//
//   Used by:
//     ✓ Dashboard alerts
//     ✓ Wealth planner
//     ✓ AI context injection
//
//   RULES
//     ✓ server-side only
//     ✓ transactions = single source of truth
//     ✓ NO AI calls
//     ✓ fast math only
//     ✓ auth based
//
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const supabase = createClient()

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

    // ------------------------------------------------------
    // Load transactions
    // ------------------------------------------------------

    const { data } = await supabase
      .from("transactions")
      .select("amount,type,date")
      .eq("user_id", user.id)

    const tx = data || []

    // ------------------------------------------------------
    // Current month only
    // ------------------------------------------------------

    const nowKey = monthKey(new Date())

    let income = 0
    let expense = 0

    for (const t of tx) {
      if (monthKey(t.date) !== nowKey) continue

      const amt = Number(t.amount)

      if (t.type === "income") income += amt
      else expense += amt
    }

    // ------------------------------------------------------
    // Burn calculations
    // ------------------------------------------------------

    const burnRate =
      income > 0
        ? Math.round((expense / income) * 100)
        : 100

    const runwayMonths =
      expense > 0
        ? Math.round((income - expense) / expense)
        : 0

    // ------------------------------------------------------
    // Response
    // ------------------------------------------------------

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

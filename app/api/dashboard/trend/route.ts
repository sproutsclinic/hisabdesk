// ==========================================================
// HisabDesk — Dashboard Trend API
// ----------------------------------------------------------
// PURPOSE
//   Monthly income vs expense trend data
//
//   Returns:
//     [
//       { month: "2026-01", income: 50000, expense: 32000 },
//       ...
//     ]
//
//   Used by:
//     ✓ dashboard charts
//     ✓ future analytics
//     ✓ AI context
//
//   RULES
//     ✓ server-side only
//     ✓ NO AI calls
//     ✓ transactions = single source of truth
//     ✓ fast aggregation
//     ✓ auth based
//
// ==========================================================

import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase" // ✅ FIXED

export const dynamic = "force-dynamic"

const supabase = getSupabaseClient() // ✅ FIXED

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
    // Aggregate by month
    // ------------------------------------------------------

    const map: Record<string, { income: number; expense: number }> = {}

    for (const t of tx) {
      const key = monthKey(t.date)

      if (!map[key]) {
        map[key] = { income: 0, expense: 0 }
      }

      const amt = Number(t.amount)

      if (t.type === "income") map[key].income += amt
      else map[key].expense += amt
    }

    // ------------------------------------------------------
    // Last 6 months only
    // ------------------------------------------------------

    const sorted = Object.entries(map)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .slice(-6)
      .map(([month, v]) => ({
        month,
        income: v.income,
        expense: v.expense,
      }))

    return NextResponse.json(sorted)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
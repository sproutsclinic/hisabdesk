// ==========================================================
// HisabDesk — Dashboard Alerts API
// ----------------------------------------------------------
// PURPOSE
//   Generates rule-based financial alerts (NO AI)
//
//   Why:
//     ✓ instant (0 cost)
//     ✓ always available fallback
//     ✓ feeds AI context
//     ✓ used by dashboard + insights
//
//   Returns:
//     [
//       { type: "warning", message: "Savings rate below 20%" },
//       { type: "info", message: "High food spending detected" }
//     ]
//
//   RULES
//     ✓ server-side only
//     ✓ NO AI calls
//     ✓ transactions = single source of truth
//     ✓ cheap math only
//     ✓ auth based
//
//   NOTE
//     This complements AI insights.
//     Alerts = deterministic
//     AI = intelligent suggestions
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
      .select("amount,type,date,category")
      .eq("user_id", user.id)

    const tx = data || []

    const now = monthKey(new Date())

    let income = 0
    let expense = 0

    const categoryMap: Record<string, number> = {}

    // ------------------------------------------------------
    // Aggregate current month only
    // ------------------------------------------------------

    for (const t of tx) {
      if (monthKey(t.date) !== now) continue

      const amt = Number(t.amount)

      if (t.type === "income") {
        income += amt
      } else {
        expense += amt

        const cat = t.category || "Other"
        categoryMap[cat] = (categoryMap[cat] || 0) + amt
      }
    }

    const savings = income - expense
    const savingsRate = income > 0 ? (savings / income) * 100 : 0

    const alerts: {
      type: "info" | "warning" | "danger"
      message: string
    }[] = []

    // ------------------------------------------------------
    // RULES
    // ------------------------------------------------------

    if (income > 0 && expense / income > 0.85) {
      alerts.push({
        type: "danger",
        message: "Expenses are above 85% of income this month",
      })
    }

    if (income > 0 && savingsRate < 20) {
      alerts.push({
        type: "warning",
        message: "Savings rate below 20%",
      })
    }

    if (savings < 0) {
      alerts.push({
        type: "danger",
        message: "You are spending more than you earn",
      })
    }

    const top = Object.entries(categoryMap).sort(
      (a, b) => b[1] - a[1]
    )[0]

    if (top && expense > 0) {
      const percent = (top[1] / expense) * 100

      if (percent > 40) {
        alerts.push({
          type: "info",
          message: `${top[0]} takes ${Math.round(percent)}% of expenses`,
        })
      }
    }

    if (alerts.length === 0) {
      alerts.push({
        type: "info",
        message: "Your finances look stable 👍",
      })
    }

    return NextResponse.json(alerts)
  } catch {
    return NextResponse.json([])
  }
}
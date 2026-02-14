// ==========================================================
// HisabDesk — Dashboard Categories API
// ----------------------------------------------------------
// PURPOSE
//   Expense category breakdown for dashboard
//
//   Returns:
//     [
//       { category: "Food", amount: 12000 },
//       { category: "Rent", amount: 25000 },
//       ...
//     ]
//
//   Used by:
//     ✓ Top Spending card
//     ✓ pie charts
//     ✓ AI insights context
//
//   RULES
//     ✓ server-side only
//     ✓ NO AI calls
//     ✓ transactions = single source of truth
//     ✓ expense only aggregation
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
// GET
// ==========================================================

export async function GET() {
  try {
    const user = await getUser()

    // ------------------------------------------------------
    // Load only expense transactions
    // ------------------------------------------------------

    const { data } = await supabase
      .from("transactions")
      .select("amount, category")
      .eq("user_id", user.id)
      .eq("type", "expense")

    const tx = data || []

    // ------------------------------------------------------
    // Aggregate by category
    // ------------------------------------------------------

    const map: Record<string, number> = {}

    for (const t of tx) {
      const cat = t.category || "Other"
      map[cat] = (map[cat] || 0) + Number(t.amount)
    }

    // ------------------------------------------------------
    // Sort + top categories first
    // ------------------------------------------------------

    const result = Object.entries(map)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)

    return NextResponse.json(result)
  } catch {
    // safe fallback (never break dashboard)
    return NextResponse.json([])
  }
}
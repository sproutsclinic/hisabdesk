ï»¿// ==========================================================
// HisabDesk â€” Dashboard Savings Rate API
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
// GET
// ==========================================================

export async function GET() {
  try {
    const user = await getUser()

    const { data } = await supabase
      .from("transactions")
      .select("amount,type")
      .eq("user_id", user.id)

    const tx = data || []

    let income = 0
    let expense = 0

    for (const t of tx) {
      const amt = Number(t.amount)

      if (t.type === "income") income += amt
      else expense += amt
    }

    const savings = income - expense

    const savingsRate =
      income > 0
        ? Math.round((savings / income) * 100)
        : 0

    return NextResponse.json({
      income,
      expense,
      savings,
      savingsRate,
    })
  } catch {
    return NextResponse.json({
      income: 0,
      expense: 0,
      savings: 0,
      savingsRate: 0,
    })
  }
}

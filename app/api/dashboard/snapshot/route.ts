// ==========================================================
// HisabDesk — Dashboard Snapshot API
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase" // ✅ FIX: server client

export const dynamic = "force-dynamic"

// ==========================================================
// GET
// ==========================================================

export async function GET() {
  try {
    const supabase = createClient() // ✅ create per request (server safe)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // ✅ never break dashboard
      return NextResponse.json({
        income: 0,
        expense: 0,
        networth: 0,
        savingsRate: 0,
      })
    }

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
      income > 0 ? Math.round((savings / income) * 100) : 0

    const [{ data: assets }, { data: liabilities }] =
      await Promise.all([
        supabase.from("assets").select("value").eq("user_id", user.id),
        supabase.from("liabilities").select("value").eq("user_id", user.id),
      ])

    const totalAssets =
      assets?.reduce((s, a) => s + Number(a.value), 0) || 0

    const totalLiabilities =
      liabilities?.reduce((s, l) => s + Number(l.value), 0) || 0

    const networth = totalAssets - totalLiabilities

    return NextResponse.json({
      income,
      expense,
      networth,
      savingsRate,
    })
  } catch {
    return NextResponse.json({
      income: 0,
      expense: 0,
      networth: 0,
      savingsRate: 0,
    })
  }
}
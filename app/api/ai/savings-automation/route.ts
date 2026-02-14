// ==========================================================
// HisabDesk — AI Savings Automation
// PURPOSE
//   Suggest automatic savings transfer amount
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

// ==========================================================

export async function POST() {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const since = new Date()
    since.setMonth(since.getMonth() - 3)

    const date = since.toISOString().slice(0, 10)

    // ------------------------------------------------------
    // Fetch income
    // ------------------------------------------------------

    const { data: incomeRows } = await supabase
      .from("incomes")
      .select("amount")
      .eq("user_id", user.id)
      .gte("date", date)

    const { data: expenseRows } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", user.id)
      .gte("date", date)

    const income =
      incomeRows?.reduce((s, r) => s + Number(r.amount), 0) || 0

    const expense =
      expenseRows?.reduce((s, r) => s + Number(r.amount), 0) || 0

    const avgIncome = income / 3
    const avgExpense = expense / 3

    const safeSavings = Math.max(avgIncome - avgExpense, 0)

    const suggested = Math.round(safeSavings * 0.7)

    // ------------------------------------------------------
    // AI advice
    // ------------------------------------------------------

    const prompt = `
Income=${Math.round(avgIncome)}
Expense=${Math.round(avgExpense)}
SafeSavings=${Math.round(safeSavings)}
Suggested=${suggested}

Give short savings advice.
Include 1 line telling user how much to auto-transfer monthly.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    return NextResponse.json({
      amount: suggested,
      advice: result.text,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

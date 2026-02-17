ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import { buildAIContext } from "@/lib/modules/personal"
import { safeRunAI } from "@/lib/ai/safeRunAI"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount,type,category")
      .eq("user_id", user.id)

    let income = 0
    let expense = 0

    for (const t of transactions || []) {
      const amt = Number(t.amount)
      if (t.type === "income") income += amt
      else expense += amt
    }

    const ctx = buildAIContext({
      income,
      expense,
      savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
    })

    const prompt = JSON.stringify(ctx)

    const result = await safeRunAI({
      userId: user.id,
      prompt,
      type: "module",
      module: "page-assistant",
    })

    return NextResponse.json({ text: result.text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

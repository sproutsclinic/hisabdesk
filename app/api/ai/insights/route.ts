// ==========================================================
// HisabDesk — AI Insights API (SERVER SAFE • FINAL)
// ==========================================================

import { NextResponse } from "next/server"

/* ✅ MUST use server client — NOT browser client */
import { createClient } from "@/lib/supabase/server"

import { safeRunAI } from "@/lib/ai/safeRun"
import {
  FINANCE_SYSTEM_PROMPT,
  MODULE_INSIGHT_PROMPT,
} from "@/lib/ai/prompts"

import { buildAIContext } from "@/lib/modules/personal"

export const dynamic = "force-dynamic"

/* =========================================================
   AUTH (SERVER SESSION)
========================================================= */

async function getUser() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return { user, supabase }
}

/* =========================================================
   POST
========================================================= */

export async function POST() {
  try {
    const { user, supabase } = await getUser()

    /* ------------------------------------------------------
       SINGLE SOURCE → transactions table
    ------------------------------------------------------ */

    const { data: tx } = await supabase
      .from("transactions")
      .select("amount,type,category")
      .eq("user_id", user.id)

    const transactions = tx || []

    let income = 0
    let expense = 0

    const categoryMap: Record<string, number> = {}

    for (const t of transactions) {
      const amt = Number(t.amount)

      if (t.type === "income") income += amt
      else expense += amt

      if (t.type === "expense") {
        const cat = t.category || "Misc"
        categoryMap[cat] = (categoryMap[cat] || 0) + amt
      }
    }

    const savingsRate =
      income > 0 ? Math.round(((income - expense) / income) * 100) : 0

    /* ------------------------------------------------------
       Build Context
    ------------------------------------------------------ */

    const ctx = buildAIContext({
      income,
      expense,
      savingsRate,
    })

    const prompt = `
User Financial Snapshot:
${ctx}

Expense Categories:
${JSON.stringify(categoryMap)}

Give:
- overspending alerts
- savings improvements
- 3–5 short bullets only

${MODULE_INSIGHT_PROMPT}
`

    /* ------------------------------------------------------
       SAFE AI CALL
    ------------------------------------------------------ */

    const result = await safeRunAI({
      userId: user.id,
      prompt,
      type: "module",
      system: FINANCE_SYSTEM_PROMPT,
      module: "dashboard-insights",
    })

    return NextResponse.json({
      text: result.text,   // ← matches Insights page expectation
    })
  } catch (e) {
    console.error("AI insights error:", e)

    return NextResponse.json({
      text: "Unable to generate insights right now.",
    })
  }
}
/* =========================================================
   HisabDesk — AI Automation Advisor API
   ---------------------------------------------------------
   SERVER ONLY (AI)

   PURPOSE
   - Analyze recurring rules
   - Detect heavy fixed expenses
   - Suggest optimizations
   - Budget improvement tips

   ARCHITECTURE
     client hook → /api/ai/automation/advice
                   ↓
                contextBuilder
                   ↓
                safeRunAI

   RULES
   ✅ server only
   ✅ OpenAI allowed here only
   ❌ no client trust
   ❌ no business math here
   ❌ no UI logic

   MODEL
   - GPT-3.5 (cheap insights)

   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { safeRunAI } from "@/lib/ai/safeRunAI"
import { runChatModel } from "@/lib/ai/openai"
import { AUTOMATION_ADVISOR_PROMPT } from "@/lib/ai/prompts"

import { getAutomationOverview } from "@/lib/api/automation/service"

/* =========================================================
   SERVER CLIENT
   ========================================================= */

function getServerClient(req: NextRequest) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") || "",
        },
      },
    },
  )
}

/* =========================================================
   POST /api/ai/automation/advice
   ========================================================= */

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerClient(req)

    /* -----------------------------------------------------
       AUTH
       ----------------------------------------------------- */

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { text: "Unauthorized" },
        { status: 401 },
      )
    }

    /* -----------------------------------------------------
       LOAD REAL DATA (server authority)
       ----------------------------------------------------- */

    const overview = await getAutomationOverview(user.id)

    const rules = overview.rules

    const monthlyIncome = overview.summary.monthlyIncome
    const monthlyExpense = overview.summary.monthlyExpense
    const net = overview.summary.netMonthlyImpact

    /* -----------------------------------------------------
       BUILD ULTRA COMPACT CONTEXT (cheap tokens)
       ----------------------------------------------------- */

    const ruleText = rules
      .map(
        (r) =>
          `${r.type}:${r.name}:${r.amount}:${r.frequency}`,
      )
      .join(",")

    const context = `
monthlyIncome=${monthlyIncome}
monthlyExpense=${monthlyExpense}
net=${net}
rules=${ruleText}
`

    /* -----------------------------------------------------
       AI CALL (safe wrapper)
       ----------------------------------------------------- */

    const text = await safeRunAI(() =>
      runChatModel([
        {
          role: "system",
          content: AUTOMATION_ADVISOR_PROMPT,
        },
        {
          role: "user",
          content: context,
        },
      ]),
    )

    return NextResponse.json({ text })
  } catch (err) {
    console.error("Automation AI error:", err)

    return NextResponse.json({
      text: "Automation advisor temporarily unavailable.",
    })
  }
}

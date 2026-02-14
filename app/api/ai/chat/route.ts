// ==========================================================
// HisabDesk — AI Chat API (FINAL • Page Aware • Personalized)
// Secure • Server-only • Cheap model
// ==========================================================

import { NextRequest, NextResponse } from "next/server"
import { runCheapChat } from "@/lib/ai/openai"
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts"
import { createClient } from "@supabase/supabase-js"

// ==========================================================
// Supabase (SERVER ONLY)
// ==========================================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ==========================================================
// PAGE CONTEXT ENGINE (pathname based)
// ==========================================================

function getPageInstruction(pathname?: string) {
  if (!pathname) return "Provide general financial assistance."

  if (pathname.startsWith("/expense"))
    return "User is on Expenses page. Focus on spending control, budgeting, cost reduction, and expense optimisation."

  if (pathname.startsWith("/income"))
    return "User is on Income page. Focus on increasing income, diversification, salary growth, and revenue ideas."

  if (pathname.startsWith("/wealth-planner"))
    return "User is on Wealth Planner. Focus on goals, SIPs, investments, compounding, retirement, and wealth creation."

  if (pathname.startsWith("/tax"))
    return "User is on Tax page. Focus strictly on Indian income tax, deductions (80C/80D/HRA), and tax saving strategies."

  if (pathname.startsWith("/insights"))
    return "User is on Insights page. Provide financial analysis, behaviour insights, and actionable improvements."

  if (pathname.startsWith("/dashboard"))
    return "User is on Dashboard. Provide high-level financial summary and next steps."

  return "Provide general financial assistance."
}

// ==========================================================
// POST /api/ai/chat
// ==========================================================

export async function POST(req: NextRequest) {
  try {
    const { messages, userId, page } = await req.json()

    if (!messages || !userId) {
      return NextResponse.json(
        { error: "messages + userId required" },
        { status: 400 }
      )
    }

    // ======================================================
    // 1️⃣ LOAD USER FINANCIAL DATA
    // ======================================================

    const [
      { data: incomes },
      { data: expenses },
      { data: goals },
    ] = await Promise.all([
      supabase.from("income").select("amount").eq("user_id", userId),
      supabase.from("expenses").select("amount").eq("user_id", userId),
      supabase
        .from("wealth_goals")
        .select("target_amount,saved_amount")
        .eq("user_id", userId),
    ])

    const totalIncome =
      incomes?.reduce((a, b) => a + Number(b.amount), 0) || 0

    const totalExpense =
      expenses?.reduce((a, b) => a + Number(b.amount), 0) || 0

    const savings = totalIncome - totalExpense

    const savingsRate =
      totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0

    const totalGoals =
      goals?.reduce((a, b) => a + Number(b.target_amount), 0) || 0

    // ======================================================
    // 2️⃣ FINANCIAL CONTEXT (personalised)
    // ======================================================

    const FINANCIAL_CONTEXT = `
User Financial Snapshot:
• Income: ₹ ${totalIncome}
• Expense: ₹ ${totalExpense}
• Savings: ₹ ${savings}
• Savings Rate: ${savingsRate}%
• Wealth Goals Target: ₹ ${totalGoals}

Use this data for personalised answers.
Keep suggestions numeric and practical.
`

    // ======================================================
    // 3️⃣ PAGE CONTEXT (NEW)
    // ======================================================

    const PAGE_CONTEXT = getPageInstruction(page)

    // ======================================================
    // 4️⃣ OPENAI CALL (cheap)
    // ======================================================

    const reply = await runCheapChat([
      {
        role: "system",
        content:
          CHAT_SYSTEM_PROMPT +
          "\n\n" +
          FINANCIAL_CONTEXT +
          "\n\nPage Context:\n" +
          PAGE_CONTEXT,
      },
      ...messages,
    ])

    return NextResponse.json({ text: reply })
  } catch (err) {
    console.error("AI CHAT ERROR:", err)

    return NextResponse.json(
      { error: "AI failed" },
      { status: 500 }
    )
  }
}

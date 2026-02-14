// ==========================================================
// HisabDesk — AI Loan Advice Route
// ----------------------------------------------------------
// PURPOSE
//   AI insights for Loans / EMI page
//
// FLOW
//   DB → liabilities → loanAdvisor → compact prompt → AI
//
// RULES
//   ✓ server-side only
//   ✓ GPT-3.5 (module type, cheap)
//   ✓ short bullets only
//   ✓ token efficient
//   ✓ logs usage
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { listLiabilities } from "@/lib/api/liabilities"
import { summarizeLoan } from "@/lib/modules/personal"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

const supabase = createClient()

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
// POST
// ==========================================================

export async function POST() {
  try {
    const user = await getUser()

    // ------------------------------------------------------
    // Fetch liabilities (loans)
    // ------------------------------------------------------

    const loans = await listLiabilities(user.id)

    let totalPrincipal = 0
    let totalEMI = 0
    let totalInterest = 0

    for (const l of loans) {
      const summary = summarizeLoan({
        principal: l.principal_amount,
        annualRate: l.interest_rate,
        tenureMonths: l.tenure_months,
        emi: l.emi,
      })

      totalPrincipal += l.principal_amount
      totalEMI += summary.emi
      totalInterest += summary.totalInterest
    }

    // ------------------------------------------------------
    // Prompt (compact)
    // ------------------------------------------------------

    const prompt = `
Loan Metrics:
principal=${Math.round(totalPrincipal)}
emi=${Math.round(totalEMI)}
interest=${Math.round(totalInterest)}

Give 4 short bullet tips to reduce loan interest or close faster.
`

    // ------------------------------------------------------
    // AI call
    // ------------------------------------------------------

    const result = await runAI({
      prompt,
      type: "module",
    })

    // ------------------------------------------------------
    // Log usage
    // ------------------------------------------------------

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "loan-advice",
      tokens: result.usage?.total_tokens ?? 0,
    })

    return NextResponse.json({
      insights: result.text,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}

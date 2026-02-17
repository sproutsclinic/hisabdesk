ï»¿import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import { getLoansOverview } from "@/lib/api/loans/service"

import { safeRunAI } from "@/lib/ai/safeRunAI"
import { LOANS_ADVISOR_PROMPT } from "@/lib/ai/loansAdvisorPrompt"

function buildLoansContext(overview: any): string {
  if (!overview?.loans?.length) {
    return "No active loans."
  }

  const lines: string[] = []

  lines.push(
    `summary outstanding=${Math.round(
      overview.summary.totalOutstanding,
    )} emi=${Math.round(
      overview.summary.totalEMI,
    )} interestLeft=${Math.round(
      overview.summary.totalInterestLeft,
    )}`,
  )

  for (const l of overview.loans) {
    lines.push(
      `loan name=${l.name} type=${l.type} rate=${l.interestRate} emi=${Math.round(
        l.emi,
      )} remaining=${l.remainingMonths} outstanding=${Math.round(
        l.outstandingPrincipal,
      )}`,
    )
  }

  return lines.join("\n")
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ text: "Unauthorized" }, { status: 401 })
    }

    const overview = await getLoansOverview(user.id)
    const context = buildLoansContext(overview)

    const result = await safeRunAI({
      userId: user.id,
      prompt: `
${LOANS_ADVISOR_PROMPT}

${context}
`,
      type: "module",
      module: "loans-advisor",
    })

    return NextResponse.json({ text: result.text })
  } catch (err) {
    console.error("Loans AI error:", err)

    return NextResponse.json({
      text: "Loans advisor temporarily unavailable.",
    })
  }
}

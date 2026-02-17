ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { listLiabilities } from "@/lib/api/liabilities"
import { summarizeLoan } from "@/lib/modules/personal"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

const supabase = getSupabaseAdmin()

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")
  return user
}

export async function POST() {
  try {
    const user = await getUser()

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

    const prompt = `
Loan Metrics:
principal=${Math.round(totalPrincipal)}
emi=${Math.round(totalEMI)}
interest=${Math.round(totalInterest)}

Give 4 short bullet tips to reduce loan interest or close faster.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "loan-advice",
      tokens: result.tokens,
    })

    return NextResponse.json({
      insights: result.text,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}

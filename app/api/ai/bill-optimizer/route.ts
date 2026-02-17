ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { listBills } from "@/lib/api/bills"
import { analyzeSubscriptions } from "@/lib/modules/personal"
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

    const bills = await listBills(user.id)

    const subscriptions = bills.map((b: any) => ({
      id: b.id,
      name: b.name,
      amount: b.amount,
      frequency: b.frequency,
      isActive: true,
    }))

    const summary = analyzeSubscriptions(subscriptions, 1)

    const expensiveCount = summary.advices.filter(
      (a: any) => a.status !== "normal"
    ).length

    const totalMonthly = summary.totalMonthlyCost

    const potentialSave = summary.advices.reduce(
      (s: number, a: any) => s + a.suggestedSaving,
      0
    )

    const prompt = `
Bills Metrics:
monthlyCost=${totalMonthly}
yearlyCost=${summary.yearlyEquivalent}
problematic=${expensiveCount}
possibleSave=${Math.round(potentialSave)}

Give 4 short bullet tips to reduce subscription waste.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "bill-optimizer",
      tokens: result.tokens,
    })

    return NextResponse.json({
      insights: result.text,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}

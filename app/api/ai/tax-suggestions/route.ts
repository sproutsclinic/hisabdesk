ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: income } = await supabase
      .from("income")
      .select("amount")
      .eq("user_id", user.id)

    const totalIncome = (income || []).reduce(
      (s: number, i: any) => s + Number(i.amount || 0),
      0
    )

    const prompt = `
Tax Snapshot:
annualIncome=${Math.round(totalIncome)}

Give 4 short legal tax optimization suggestions (India context generic).
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "tax-suggestions",
      tokens: result.tokens,
    })

    return NextResponse.json({ advice: result.text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

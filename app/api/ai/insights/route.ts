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

    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount,type")
      .eq("user_id", user.id)

    let income = 0
    let expense = 0

    for (const t of transactions || []) {
      const amt = Number(t.amount)
      if (t.type === "income") income += amt
      else expense += amt
    }

    const prompt = `
Financial Snapshot:
income=${Math.round(income)}
expense=${Math.round(expense)}

Give 3 short financial improvement tips.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    return NextResponse.json({ text: result.text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

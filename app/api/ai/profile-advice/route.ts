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

    const { data: profile } = await supabase
      .from("profiles")
      .select("monthly_income, monthly_expense")
      .eq("id", user.id)
      .single()

    const income = Number(profile?.monthly_income || 0)
    const expense = Number(profile?.monthly_expense || 0)

    const prompt = `
User Profile Snapshot:
income=${Math.round(income)}
expense=${Math.round(expense)}

Give 3 short lifestyle or budgeting improvements.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "profile-advice",
      tokens: result.tokens,
    })

    return NextResponse.json({ advice: result.text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

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
      .select("age, monthly_income, savings")
      .eq("id", user.id)
      .single()

    const age = Number(profile?.age || 0)
    const income = Number(profile?.monthly_income || 0)
    const savings = Number(profile?.savings || 0)

    const prompt = `
Retirement Snapshot:
age=${age}
income=${Math.round(income)}
savings=${Math.round(savings)}

Give 4 short retirement planning suggestions.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "retirement-advice",
      tokens: result.tokens,
    })

    return NextResponse.json({ advice: result.text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

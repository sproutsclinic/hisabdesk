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

    const { data: assets } = await supabase
      .from("assets")
      .select("current_value")
      .eq("user_id", user.id)

    const totalWealth = (assets || []).reduce(
      (s: number, a: any) => s + Number(a.current_value || 0),
      0
    )

    const prompt = `
Wealth Snapshot:
total=${Math.round(totalWealth)}

Give 4 short wealth-building suggestions.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "wealth-advice",
      tokens: result.tokens,
    })

    return NextResponse.json({ advice: result.text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

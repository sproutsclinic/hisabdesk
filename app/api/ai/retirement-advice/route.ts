import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const body = await req.json()

    const prompt = `
Retirement metrics:
years=${body.years}
futureCorpus=${body.corpus}
realCorpus=${body.realCorpus}

Give 3 short tips to improve retirement readiness.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "retirement-advice",
      tokens: result.usage?.total_tokens ?? 0,
    })

    return NextResponse.json({
      insights: result.text,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}

ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import { listDocuments } from "@/lib/api/documents"
import { analyzeDocuments } from "@/lib/modules/personal"
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

    const docs = await listDocuments(user.id)
    const summary = analyzeDocuments(docs || [])

    const prompt = `
Vault Snapshot:
documents=${docs?.length || 0}

Give 4 short organization or protection suggestions.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "vault-advice",
      tokens: result.tokens,
    })

    return NextResponse.json({ advice: result.text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { runChat } from "@/lib/ai/openai"
import { BILLS_OPTIMIZE_PROMPT } from "@/lib/ai/billsOptimizePrompt"

export async function POST(req: NextRequest) {
  const { summary } = await req.json()

  const text = await runChat([
    { role: "system", content: BILLS_OPTIMIZE_PROMPT },
    { role: "user", content: summary },
  ])

  return NextResponse.json({ text })
}

/* =========================================================
   Income AI Coach
   ---------------------------------------------------------
   ✓ chat assistant
   ✓ small prompt
   ✓ cheap tokens
========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  const prompt = `
You are a personal finance coach.
Give short, actionable advice.

User question:
${message}
`

  const result = await runAI({
    prompt,
    type: "module",
  })

  return NextResponse.json({
    text: result.text,
  })
}

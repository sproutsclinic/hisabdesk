// ==========================================================
// HisabDesk — AI Expense Auto Categorizer
// PURPOSE
//   Suggest category from merchant/notes
//
// FLOW
//   text → compact prompt → cheap model → category
//
// RULES
//   ✓ tiny prompt
//   ✓ 1 word output
//   ✓ cheap tokens
// ==========================================================

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase" // ✅ fixed import
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { text } = await req.json()

    if (!text) return NextResponse.json({ category: "Other" })

    const prompt = `
Classify expense into ONE word only:

Food
Shopping
Bills
Rent
Travel
Medical
Subscriptions
Education
Entertainment
Other

Text: ${text}

Return only category word.
`

    const result = await runAI({
      prompt,
      type: "module",
    })

    const category =
      result.text?.trim().split("\n")[0] || "Other"

    return NextResponse.json({ category })
  } catch {
    return NextResponse.json({ category: "Other" })
  }
}
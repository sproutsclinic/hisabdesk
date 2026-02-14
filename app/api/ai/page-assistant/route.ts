// ==========================================================
// HisabDesk — Page AI Assistant Route (Universal)
// ----------------------------------------------------------
// PURPOSE
//   One smart assistant usable on EVERY page
//
// RULES
//   ✓ server-side only
//   ✓ ALWAYS use safeRunAI()
//   ✓ NEVER call runAI() directly
//   ✓ budget protected
//   ✓ auto logging
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

import { buildAIContext } from "@/lib/modules/personal"
import { safeRunAI } from "@/lib/ai/safeRun"
import { FINANCE_SYSTEM_PROMPT } from "@/lib/ai/prompts"

export const dynamic = "force-dynamic"

const supabase = createClient()

// ==========================================================
// AUTH
// ==========================================================

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return user
}

// ==========================================================
// TYPES
// ==========================================================

interface Body {
  message: string
  context?: {
    income?: number
    expense?: number
    savingsRate?: number
    networth?: number
    runwayMonths?: number
    burnRisk?: "low" | "medium" | "high"
    goalsBehind?: number
    alerts?: number
  }
}

// ==========================================================
// POST
// ==========================================================

export async function POST(req: Request) {
  try {
    const user = await getUser()

    const body = (await req.json()) as Body

    // ------------------------------------------------------
    // Build compact financial context
    // ------------------------------------------------------

    const ctx = buildAIContext(body.context || {})

    // ------------------------------------------------------
    // Prompt (token efficient)
    // ------------------------------------------------------

    const prompt = `
User Financial Snapshot:
${ctx}

User Question:
${body.message}

Reply short. Finance/tax topics only.
`

    // ------------------------------------------------------
    // SAFE AI CALL (budget + logging handled automatically)
    // ------------------------------------------------------

    const result = await safeRunAI({
      userId: user.id,
      prompt,
      type: "chat",
      system: FINANCE_SYSTEM_PROMPT,
      module: "page-assistant",
    })

    return NextResponse.json({
      reply: result.text,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}

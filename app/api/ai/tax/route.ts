/* =========================================================
   HisabDesk — AI Tax Optimizer API (SERVER SAFE VERSION)
   ========================================================= */

import { NextRequest, NextResponse } from "next/server"

/* ✅ CRITICAL FIX — use server wrapper */
import { createClient } from "@/lib/supabase/server"

import { safeRunAI } from "@/lib/ai/safeRunAI"
import { TAX_ADVISOR_PROMPT } from "@/lib/ai/prompts"
import { buildTaxContext } from "@/lib/ai/contextBuilder"
import { getLatestTaxCalculation } from "@/lib/api/tax/service"

export const dynamic = "force-dynamic"

/* =========================================================
   POST /api/ai/tax
   ========================================================= */

export async function POST(req: NextRequest) {
  try {
    /* ✅ session-aware client */
    const supabase = createClient()

    /* -----------------------------------------------------
       1️⃣ AUTH (server session only)
       ----------------------------------------------------- */
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* -----------------------------------------------------
       2️⃣ BODY
       ----------------------------------------------------- */
    const body = await req.json().catch(() => ({}))
    const financialYear = body?.financialYear || "2024-25"

    /* -----------------------------------------------------
       3️⃣ LOAD SERVER TRUTH
       ----------------------------------------------------- */
    const latest = await getLatestTaxCalculation(
      user.id,
      financialYear
    )

    if (!latest) {
      return NextResponse.json(
        { error: "Run tax calculator first." },
        { status: 400 }
      )
    }

    /* -----------------------------------------------------
       4️⃣ CONTEXT
       ----------------------------------------------------- */
    const context = buildTaxContext(latest.result)

    /* -----------------------------------------------------
       5️⃣ SAFE AI CALL
       ----------------------------------------------------- */
    const message = await safeRunAI({
      model: "gpt-4",
      temperature: 0.2,
      maxTokens: 700,
      systemPrompt: TAX_ADVISOR_PROMPT,
      userMessage: `
User Tax Snapshot:

${context}

Give:
• Best regime reasoning
• Missed deductions
• Tax saving strategies
• Compliance warnings
• 5 step action plan

Be concise and actionable.
`,
    })

    /* -----------------------------------------------------
       6️⃣ RESPONSE
       ----------------------------------------------------- */
    return NextResponse.json({
      success: true,
      message,
    })
  } catch (err) {
    console.error("AI tax optimizer error:", err)

    return NextResponse.json(
      { error: "Tax optimizer temporarily unavailable." },
      { status: 500 }
    )
  }
}
ï»¿// ==========================================================
// Insights API Route
// Layer: API (HTTP Boundary)
// FINAL ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â aligned with Safe AI architecture
// ==========================================================

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { safeRunAI } from "@/lib/ai/safeRunAI"
import { getInsightsService } from "@/lib/api/insights/service"

export const dynamic = "force-dynamic"

/* =========================================================
   AUTH (Server Session)
========================================================= */

async function getUser() {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return { user }
}

/* =========================================================
POST /api/insights
========================================================= */

export async function POST(req: Request) {
  try {
    const { user } = await getUser()

    const insightsService = getInsightsService()

    // Optional body parameters (range control)
    const body = await req.json().catch(() => ({}))

    const range =
      typeof body?.range === "string" ? body.range : "90d"

    // -------------------------------------------------------
    // Domain Snapshot (NO AI here)
    // -------------------------------------------------------

    const snapshot = await insightsService.getInsightsSnapshot({
      userId: user.id,
      range,
    })

    // -------------------------------------------------------
    // AI Interpretation Layer
    // -------------------------------------------------------

    const aiResult = await safeRunAI({
      userId: user.id,
      type: "module",
      module: "insights-summary",
      prompt: `
You are analysing a user's financial operating system snapshot.

DATA:
${JSON.stringify(snapshot)}

TASK:
Provide:
1. A concise financial health summary.
2. Key risks (if any).
3. 3 actionable recommendations.
4. One behavioural insight about spending or investing.

Do not hallucinate. Use only provided data.
`,
    })

    // -------------------------------------------------------
    // Response
    // -------------------------------------------------------

    return NextResponse.json({
      snapshot,
      narrative: aiResult.text,
    })
  } catch (e) {
    console.error("Insights route error:", e)

    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    )
  }
}

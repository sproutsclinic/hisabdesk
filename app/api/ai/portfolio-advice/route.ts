// ==========================================================
// HisabDesk — AI Portfolio Advice Route
// ----------------------------------------------------------
// PURPOSE
//   AI insights for Portfolio / Investments page
//
// FLOW
//   DB → assets → portfolioAdvisor → compact prompt → AI
//
// RULES
//   ✓ server-side only
//   ✓ GPT-3.5 (module type, cheap)
//   ✓ short bullets only
//   ✓ token efficient
//   ✓ logs usage
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { listAssets } from "@/lib/api/assets"
import { analyzePortfolio } from "@/lib/modules/personal"
import { runAI } from "@/lib/ai/openai"

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
// POST
// ==========================================================

export async function POST() {
  try {
    const user = await getUser()

    // ------------------------------------------------------
    // Fetch assets
    // ------------------------------------------------------

    const assets = await listAssets(user.id)

    const mapped = assets.map((a: any) => ({
      assetClass: a.asset_class,
      value: a.current_value,
    }))

    // ------------------------------------------------------
    // Analyze allocation
    // ------------------------------------------------------

    const analysis = analyzePortfolio(mapped, "medium")

    const equity =
      analysis.allocation.find((a) => a.assetClass === "equity")
        ?.percent ?? 0

    const debt =
      analysis.allocation.find((a) => a.assetClass === "debt")
        ?.percent ?? 0

    const topDiff = analysis.rebalance
      .sort((a, b) => Math.abs(b.differencePercent) - Math.abs(a.differencePercent))[0]

    // ------------------------------------------------------
    // Prompt (compact)
    // ------------------------------------------------------

    const prompt = `
Portfolio Metrics:
total=${analysis.totalValue}
equity=${equity}
debt=${debt}
imbalance=${topDiff?.differencePercent ?? 0}

Give 4 short bullet allocation or rebalance tips.
`

    // ------------------------------------------------------
    // AI call
    // ------------------------------------------------------

    const result = await runAI({
      prompt,
      type: "module",
    })

    // ------------------------------------------------------
    // Log usage
    // ------------------------------------------------------

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "portfolio-advice",
      tokens: result.usage?.total_tokens ?? 0,
    })

    return NextResponse.json({
      insights: result.text,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}

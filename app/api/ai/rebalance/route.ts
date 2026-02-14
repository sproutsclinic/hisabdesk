/* =========================================================
   HisabDesk — AI Portfolio Rebalance API
   ---------------------------------------------------------
   SERVER ONLY (AI ROUTE)

   PURPOSE
   - Generate AI-based rebalance advice
   - Uses:
       ✓ DB portfolio data
       ✓ compact context
       ✓ safeRunAI wrapper
   - Never trust client numbers

   ARCHITECTURE
     client
       ↓
     /api/ai/portfolio/rebalance
       ↓
     service (DB fetch)
       ↓
     contextBuilder
       ↓
     safeRunAI (OpenAI server)
       ↓
     text response

   RULES
   ✅ server only
   ✅ OpenAI allowed here
   ❌ no calculations
   ❌ no business logic
   ❌ no client provided portfolio

   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { safeRunAI } from "@/lib/ai/safeRunAI"
import { PORTFOLIO_REBALANCE_PROMPT } from "@/lib/ai/portfolioRebalancePrompt"

import { getPortfolioOverview } from "@/lib/api/portfolio/service"
import { buildAIContext } from "@/lib/ai/contextBuilder"

/* =========================================================
   SERVER CLIENT (session based)
   ========================================================= */

function getServerClient(req: NextRequest) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") || "",
        },
      },
    },
  )
}

/* =========================================================
   POST /api/ai/portfolio/rebalance
   ========================================================= */

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerClient(req)

    /* -----------------------------------------------------
       AUTH
       ----------------------------------------------------- */
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    /* -----------------------------------------------------
       LOAD REAL PORTFOLIO (SERVER AUTHORITY)
       ----------------------------------------------------- */
    const overview = await getPortfolioOverview(user.id)

    if (!overview || !overview.assets?.length) {
      return NextResponse.json({
        text: "Add assets to receive portfolio advice.",
      })
    }

    /* -----------------------------------------------------
       BUILD COMPACT CONTEXT
       ----------------------------------------------------- */

    const baseContext = buildAIContext({
      assets: overview.summary.totalCurrent,
      networth: overview.summary.totalCurrent,
    })

    const portfolioText = overview.assets
      .map(
        (a: any) =>
          `${a.name}:${a.type}:${a.allocationPercent}:${a.returnPercent}`,
      )
      .join("\n")

    const userContent = `
${baseContext}

portfolio:
${portfolioText}
`

    /* -----------------------------------------------------
       AI CALL (safe wrapper)
       ----------------------------------------------------- */

    const text = await safeRunAI({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: PORTFOLIO_REBALANCE_PROMPT,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      maxTokens: 250,
    })

    /* -----------------------------------------------------
       RESPONSE
       ----------------------------------------------------- */

    return NextResponse.json({ text })
  } catch (err) {
    console.error("Portfolio AI error:", err)

    return NextResponse.json({
      text: "Portfolio advisor temporarily unavailable.",
    })
  }
}

/* =========================================================
   HisabDesk — AI Loans Advisor API
   ---------------------------------------------------------
   SERVER ONLY

   PURPOSE
   - Provide payoff / EMI optimization advice
   - Build compact financial context
   - Call OpenAI safely (server only)
   - Never trust client numbers

   ARCHITECTURE
     client → hook → /api/ai/loans
                     ↓
                 service(DB) → context → safeRunAI → GPT

   RULES
   ✅ server only
   ✅ DB as source of truth
   ✅ finance-only answers
   ❌ no client calculations
   ❌ no business logic here
   ❌ no direct OpenAI usage in client

   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { getLoansOverview } from "@/lib/api/loans/service"

import { safeRunAI } from "@/lib/ai/safeRunAI"
import { LOANS_ADVISOR_PROMPT } from "@/lib/ai/loansAdvisorPrompt"

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
   BUILD CONTEXT (token cheap)
   ========================================================= */

function buildLoansContext(overview: any): string {
  if (!overview?.loans?.length) {
    return "No active loans."
  }

  const lines: string[] = []

  lines.push(
    `summary outstanding=${Math.round(
      overview.summary.totalOutstanding,
    )} emi=${Math.round(
      overview.summary.totalEMI,
    )} interestLeft=${Math.round(
      overview.summary.totalInterestLeft,
    )}`,
  )

  for (const l of overview.loans) {
    lines.push(
      `loan name=${l.name} type=${l.type} rate=${l.interestRate} emi=${Math.round(
        l.emi,
      )} remaining=${l.remainingMonths} outstanding=${Math.round(
        l.outstandingPrincipal,
      )}`,
    )
  }

  return lines.join("\n")
}

/* =========================================================
   POST /api/ai/loans
   ========================================================= */

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerClient(req)

    /* ---------- AUTH ---------- */
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { text: "Unauthorized" },
        { status: 401 },
      )
    }

    /* ---------- LOAD REAL DATA ---------- */
    const overview = await getLoansOverview(user.id)

    const context = buildLoansContext(overview)

    /* ---------- AI ---------- */
    const text = await safeRunAI({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: LOANS_ADVISOR_PROMPT },
        { role: "user", content: context },
      ],
      maxTokens: 350,
    })

    return NextResponse.json({ text })
  } catch (err) {
    console.error("Loans AI error:", err)

    return NextResponse.json({
      text: "Loans advisor temporarily unavailable.",
    })
  }
}

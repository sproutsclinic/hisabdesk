/* =========================================================
   HisabDesk — AI Bills Optimizer API
   ---------------------------------------------------------
   SERVER ROUTE ONLY

   PURPOSE
   - Generate AI suggestions to reduce recurring bills
   - Reads real DB data (server authority)
   - Builds compact context
   - Calls OpenAI safely

   ARCHITECTURE
     client
        ↓
     /api/ai/bills
        ↓
     DB fetch (bills + totals)
        ↓
     prompt builder
        ↓
     safeRunAI()

   RULES
   ✅ server only
   ✅ uses real DB data
   ✅ no client trust
   ❌ no business logic
   ❌ no math here
   ❌ no direct OpenAI call (must use safe wrapper)

   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { safeRunAI } from "@/lib/ai/safeRunAI"
import { BILLS_OPTIMIZER_PROMPT } from "@/lib/ai/billsOptimizerPrompt"

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
   POST /api/ai/bills
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
        { text: "Unauthorized" },
        { status: 401 },
      )
    }

    /* -----------------------------------------------------
       LOAD REAL BILLS (server truth)
       ----------------------------------------------------- */
    const { data: bills } = await supabase
      .from("bills")
      .select("name, amount, category, frequency, auto_pay")
      .eq("user_id", user.id)
      .eq("active", true)

    if (!bills || bills.length === 0) {
      return NextResponse.json({
        text: "No active bills found.",
      })
    }

    /* -----------------------------------------------------
       BUILD ULTRA COMPACT CONTEXT (cheap tokens)
       ----------------------------------------------------- */

    const total = bills.reduce(
      (a, b) => a + Number(b.amount || 0),
      0,
    )

    const compact = bills
      .map(
        (b) =>
          `${b.name}:${b.amount}:${b.category}:${b.frequency}:${b.auto_pay ? 1 : 0}`,
      )
      .join("|")

    const userText = `
total=${total}
bills=${compact}
`

    /* -----------------------------------------------------
       AI CALL (safe wrapper only)
       ----------------------------------------------------- */

    const text = await safeRunAI({
      model: "gpt-3.5-turbo", // cheap + fast
      messages: [
        { role: "system", content: BILLS_OPTIMIZER_PROMPT },
        { role: "user", content: userText },
      ],
      maxTokens: 300,
    })

    return NextResponse.json({ text })
  } catch (err) {
    console.error("Bills AI error:", err)

    return NextResponse.json({
      text: "Unable to generate optimization advice right now.",
    })
  }
}

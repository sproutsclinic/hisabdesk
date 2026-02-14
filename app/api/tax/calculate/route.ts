/* =========================================================
   HisabDesk — Tax Calculate API
   ---------------------------------------------------------
   SERVER ROUTE ONLY

   Responsibilities:
   - Auth guard
   - Validate input (central validators)
   - Call tax service
   - Return JSON

   Architecture:
     Client (hook)
        ↓
     /api/tax/calculate
        ↓
     validators.ts   ✅ centralized
        ↓
     service.ts
        ↓
     calcEngine.ts

   NEVER:
   ❌ No OpenAI here
   ❌ No business math here
   ❌ No direct DB in route

   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { calculateAndSaveTax } from "@/lib/api/tax/service"
import { sanitizeTaxProfileInput } from "@/lib/api/tax/validators"
import type { CalculateTaxRequest } from "@/lib/api/tax/types"

/* =========================================================
   SERVER CLIENT (user session based)
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
   HELPERS
   ========================================================= */

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/* =========================================================
   POST /api/tax/calculate
   ========================================================= */

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerClient(req)

    /* -----------------------------------------------------
       AUTH
       ----------------------------------------------------- */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) return bad("Unauthorized", 401)

    /* -----------------------------------------------------
       BODY
       ----------------------------------------------------- */
    const body = (await req.json()) as CalculateTaxRequest

    if (!body) return bad("Invalid payload")

    const financialYear = body.financialYear || "2024-25"

    /* -----------------------------------------------------
       SANITIZE (CENTRALIZED)
       ----------------------------------------------------- */
    const input = sanitizeTaxProfileInput({
      age: body.age,
      filingStatus: body.filingStatus,
      income: body.income,
      deductions: body.deductions,
    })

    /* -----------------------------------------------------
       SERVICE
       ----------------------------------------------------- */
    const result = await calculateAndSaveTax(
      user.id,
      financialYear,
      input,
    )

    /* -----------------------------------------------------
       RESPONSE
       ----------------------------------------------------- */
    return NextResponse.json({
      success: true,
      result,
    })
  } catch (err: any) {
    console.error("Tax calculate error:", err)

    return NextResponse.json(
      { error: "Failed to calculate tax" },
      { status: 500 },
    )
  }
}

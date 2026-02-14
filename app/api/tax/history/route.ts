/* =========================================================
   HisabDesk — Tax History API
   ---------------------------------------------------------
   PURPOSE
   - Fetch previous tax calculations for user
   - Used by:
       Tax dashboard
       Reports
       AI advisor context
       Export

   ARCHITECTURE
     Client (hook)
        ↓
     /api/tax/history
        ↓
     service.ts (DB only)

   RULES
   ❌ No business logic
   ❌ No tax math
   ❌ No OpenAI
   ✅ Auth required
   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import {
  getTaxHistory,
  getLatestTaxCalculation,
} from "@/lib/api/tax/service"

/* =========================================================
   SERVER CLIENT (session-based auth)
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
   GET /api/tax/history
   Query:
     ?latest=true&fy=2024-25
   ========================================================= */

export async function GET(req: NextRequest) {
  try {
    const supabase = getServerClient(req)

    /* ---------- AUTH ---------- */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)

    const latest = searchParams.get("latest") === "true"
    const fy = searchParams.get("fy") || "2024-25"

    /* ---------- LATEST ---------- */
    if (latest) {
      const data = await getLatestTaxCalculation(user.id, fy)

      return NextResponse.json({
        success: true,
        data,
      })
    }

    /* ---------- FULL HISTORY ---------- */
    const data = await getTaxHistory(user.id)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (err) {
    console.error("Tax history error:", err)

    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    )
  }
}

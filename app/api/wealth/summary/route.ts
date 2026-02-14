/* =========================================================
   HisabDesk — Wealth Summary API
   Server route only (SAFE VERSION)
   ========================================================= */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/* ========================================================= */

export async function GET() {
  try {
    /* -----------------------------------------
       Server client (cookie/session aware)
    ----------------------------------------- */
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* ========================================
       Assets
    ======================================== */

    const { data: assets, error: assetsErr } = await supabase
      .from("assets")
      .select("value,type")
      .eq("user_id", user.id)

    if (assetsErr) throw new Error(assetsErr.message)

    /* ========================================
       Liabilities
    ======================================== */

    const { data: liabilities, error: liabilitiesErr } =
      await supabase
        .from("liabilities")
        .select("balance")
        .eq("user_id", user.id)

    if (liabilitiesErr) throw new Error(liabilitiesErr.message)

    /* ========================================
       Goals
    ======================================== */

    const { data: goals, error: goalsErr } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)

    if (goalsErr) throw new Error(goalsErr.message)

    /* ========================================
       SAFE CALCULATIONS
    ======================================== */

    const totalAssets =
      assets?.reduce((s, a) => s + Number(a.value || 0), 0) || 0

    const totalLiabilities =
      liabilities?.reduce((s, l) => s + Number(l.balance || 0), 0) || 0

    const netWorth = totalAssets - totalLiabilities

    const allocation =
      assets?.reduce((acc: Record<string, number>, a: any) => {
        const key = a.type || "other"
        acc[key] = (acc[key] || 0) + Number(a.value || 0)
        return acc
      }, {}) || {}

    /* -----------------------------------------
       future: real historical trend
    ----------------------------------------- */
    const changePct = 0
    const trend: any[] = []

    /* ========================================
       RESPONSE
    ======================================== */

    return NextResponse.json({
      data: {
        netWorth,
        changePct,
        trend,
        allocation,
        goals: goals || [],
      },
    })
  } catch (err) {
    console.error("Wealth summary error:", err)

    return NextResponse.json(
      { error: "Failed to load wealth summary" },
      { status: 500 }
    )
  }
}
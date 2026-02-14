// ==========================================================
// HisabDesk — Dashboard Net Worth API
// ----------------------------------------------------------
// PURPOSE
//   Returns current net worth snapshot
//
//   Used by:
//     ✓ Dashboard KPI
//     ✓ Wealth planner
//     ✓ AI context injection
//
//   Net Worth = Assets - Liabilities
//
//   RULES
//     ✓ server-side only
//     ✓ NO AI calls
//     ✓ fast aggregation
//     ✓ auth based
//     ✓ safe fallback
//
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

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
// GET
// ==========================================================

export async function GET() {
  try {
    const user = await getUser()

    // ------------------------------------------------------
    // Load assets + liabilities in parallel
    // ------------------------------------------------------

    const [{ data: assets }, { data: liabilities }] =
      await Promise.all([
        supabase
          .from("assets")
          .select("value")
          .eq("user_id", user.id),

        supabase
          .from("liabilities")
          .select("value")
          .eq("user_id", user.id),
      ])

    // ------------------------------------------------------
    // Aggregate
    // ------------------------------------------------------

    const totalAssets =
      assets?.reduce((s, a) => s + Number(a.value), 0) || 0

    const totalLiabilities =
      liabilities?.reduce(
        (s, l) => s + Number(l.value),
        0
      ) || 0

    const networth = totalAssets - totalLiabilities

    // ------------------------------------------------------
    // Response
    // ------------------------------------------------------

    return NextResponse.json({
      assets: totalAssets,
      liabilities: totalLiabilities,
      networth,
    })
  } catch {
    // never break UI
    return NextResponse.json({
      assets: 0,
      liabilities: 0,
      networth: 0,
    })
  }
}

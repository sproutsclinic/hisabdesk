ï»¿/* =========================================================
Income â†’ SIP Suggestions Engine
---------------------------------------------------------
PURPOSE
âœ” convert surplus into smart investment allocation
âœ” rule-based (fast + free)
âœ” no AI (math only)
========================================================= */

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

/* =========================================================
DOMAIN TYPES (must be OUTSIDE handler)
========================================================= */

type RiskLevel = "conservative" | "moderate" | "aggressive"

type Allocation = {
  equity: number
  debt: number
  gold: number
}

/**
 * Wrapped in function so Next.js doesn't freeze literal type.
 * Later this will read from user profile table.
 */
function getRiskProfile(): RiskLevel {
  return "moderate"
}

/* =========================================================
ROUTE
========================================================= */

export async function GET() {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  /* ---------------- income total ---------------- */

  const { data: rows } = await supabase
    .from("income")
    .select("amount")
    .eq("user_id", user.id)

  const total =
    rows?.reduce((s, r) => s + Number(r.amount || 0), 0) || 0

  /* ---------------- autosave 20% ---------------- */

  const autosave = Math.round(total * 0.2)

  /* ---------------- risk profile ---------------- */

  const risk = getRiskProfile()

  let allocation: Allocation

  if (risk === "conservative") {
    allocation = { equity: 0.3, debt: 0.6, gold: 0.1 }
  } else if (risk === "aggressive") {
    allocation = { equity: 0.8, debt: 0.15, gold: 0.05 }
  } else {
    allocation = { equity: 0.6, debt: 0.3, gold: 0.1 }
  }

  /* ---------------- calculation ---------------- */

  const result = {
    totalIncome: total,
    autosave,
    equity: Math.round(autosave * allocation.equity),
    debt: Math.round(autosave * allocation.debt),
    gold: Math.round(autosave * allocation.gold),
  }

  return NextResponse.json({ data: result })
}

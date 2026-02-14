/* =========================================================
   Income → SIP Suggestions Engine
   ---------------------------------------------------------
   PURPOSE
   ✓ convert surplus into smart investment allocation
   ✓ rule-based (fast + free)
   ✓ no AI (math only)

   LOGIC
   autosave → split by risk profile

========================================================= */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  /* ---------------- income total ---------------- */

  const { data: rows } = await supabase
    .from("income")
    .select("amount")
    .eq("user_id", user.id)

  const total =
    rows?.reduce((s, r) => s + Number(r.amount || 0), 0) || 0

  /* ---------------- autosave 20% ---------------- */

  const autosave = Math.round(total * 0.2)

  /* ---------------- risk profile ----------------
     default = moderate
     (later you can fetch from profile table)
  ------------------------------------------------ */

  const risk = "moderate"

  let allocation: any

  if (risk === "conservative") {
    allocation = {
      equity: 0.3,
      debt: 0.6,
      gold: 0.1,
    }
  } else if (risk === "aggressive") {
    allocation = {
      equity: 0.8,
      debt: 0.15,
      gold: 0.05,
    }
  } else {
    allocation = {
      equity: 0.6,
      debt: 0.3,
      gold: 0.1,
    }
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

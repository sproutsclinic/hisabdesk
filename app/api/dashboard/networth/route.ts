ï»¿// ==========================================================
// HisabDesk â€” Dashboard Net Worth API
// ==========================================================

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

const supabase = getSupabaseAdmin()

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

    const totalAssets =
      assets?.reduce((s, a) => s + Number(a.value), 0) || 0

    const totalLiabilities =
      liabilities?.reduce((s, l) => s + Number(l.value), 0) || 0

    const networth = totalAssets - totalLiabilities

    return NextResponse.json({
      assets: totalAssets,
      liabilities: totalLiabilities,
      networth,
    })
  } catch {
    return NextResponse.json({
      assets: 0,
      liabilities: 0,
      networth: 0,
    })
  }
}

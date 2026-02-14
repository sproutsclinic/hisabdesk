import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeMerchant } from "@/lib/expense/merchantNormalizer"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date")

  const rows = data ?? []

  /* ===============================
     Merchant grouping
  =============================== */

  const merchantMap: Record<string, number> = {}

  rows.forEach((r: any) => {
    const merchant = normalizeMerchant(r.notes)
    merchantMap[merchant] =
      (merchantMap[merchant] || 0) + Number(r.amount)
  })

  const merchants = Object.entries(merchantMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return NextResponse.json({
    data: {
      rows,
      merchants,
    },
  })
}
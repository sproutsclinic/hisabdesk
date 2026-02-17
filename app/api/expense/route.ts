ï»¿/* =========================================================
   HisabDesk â€” Expense List API
   ---------------------------------------------------------
   âœ“ server only
   âœ“ auth based
   âœ“ returns rows for expense page
   âœ“ NO AI
========================================================= */

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )

    const { data } = await supabase
      .from("transactions")
      .select("id,date,amount,category,notes")
      .eq("user_id", user.id)
      .eq("type", "expense")
      .order("date", { ascending: false })

    return NextResponse.json({
      data: {
        rows: data || [],
      },
    })
  } catch {
    return NextResponse.json(
      { data: { rows: [] } },
      { status: 200 }
    )
  }
}

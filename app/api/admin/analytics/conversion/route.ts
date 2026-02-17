ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/*
  PHASE 16 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Conversion Stats

  GET /api/admin/analytics/conversion

  Returns:
  {
    signups: number,
    paid: number,
    conversionRate: number
  }
*/

const supabase = getSupabaseAdmin()

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("analytics_events")
      .select("event")

    if (error) throw error

    let signups = 0
    let paid = 0

    data?.forEach((row) => {
      if (row.event === "signup_completed") signups++
      if (row.event === "payment_success") paid++
    })

    const conversionRate =
      signups === 0 ? 0 : Math.round((paid / signups) * 100)

    return NextResponse.json({
      signups,
      paid,
      conversionRate,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { signups: 0, paid: 0, conversionRate: 0 },
      { status: 500 }
    )
  }
}



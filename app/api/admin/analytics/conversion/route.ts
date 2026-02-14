import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/*
  PHASE 16 — Conversion Stats

  GET /api/admin/analytics/conversion

  Returns:
  {
    signups: number,
    paid: number,
    conversionRate: number
  }
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

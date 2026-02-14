import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/*
  Funnel steps (order matters)

  signup_completed → login → income_added → tax_calculated → upgrade_clicked → payment_success
*/

const FUNNEL = [
  "signup_completed",
  "login",
  "income_added",
  "tax_calculated",
  "upgrade_clicked",
  "payment_success",
]

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("analytics_events")
      .select("event")

    if (error) throw error

    const map: Record<string, number> = {}

    data?.forEach((row) => {
      map[row.event] = (map[row.event] || 0) + 1
    })

    const base = map[FUNNEL[0]] || 1

    const result = FUNNEL.map((step) => {
      const count = map[step] || 0

      return {
        step,
        count,
        conversion: Math.round((count / base) * 100),
      }
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json([], { status: 500 })
  }
}

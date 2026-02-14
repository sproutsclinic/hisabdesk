import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/*
  Returns:
  [
    { event: "signup_completed", count: 120 },
    { event: "payment_success", count: 34 }
  ]
*/

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

    const result = Object.entries(map).map(([event, count]) => ({
      event,
      count,
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json([], { status: 500 })
  }
}

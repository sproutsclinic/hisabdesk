import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/*
  PHASE 18 — Per User Activity API

  GET /api/admin/users/activity?userId=xxx

  Returns:
  - audit logs
  - analytics events
  (latest first)
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json([], { status: 400 })
    }

    const [audits, events] = await Promise.all([
      supabase
        .from("audit_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100),

      supabase
        .from("analytics_events")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100),
    ])

    const combined = [
      ...(audits.data || []).map((a) => ({
        type: "audit",
        ...a,
      })),
      ...(events.data || []).map((e) => ({
        type: "event",
        ...e,
      })),
    ].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )

    return NextResponse.json(combined)
  } catch (err) {
    console.error(err)
    return NextResponse.json([], { status: 500 })
  }
}

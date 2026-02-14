import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/*
  PHASE 18 — Activity History

  Returns latest audit logs for admin UI

  GET /api/admin/activity
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("id, action, user_id, meta, created_at")
      .order("created_at", { ascending: false })
      .limit(200)

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err) {
    console.error(err)
    return NextResponse.json([], { status: 500 })
  }
}

ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

/*
  PHASE 18 Ã¢â‚¬â€ Activity History

  Returns latest audit logs for admin UI

  GET /api/admin/activity
*/

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("audit_logs")
      .select("id, action, user_id, meta, created_at")
      .order("created_at", { ascending: false })
      .limit(200)

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err) {
    console.error("Activity API Error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

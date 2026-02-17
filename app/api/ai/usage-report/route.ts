ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import { buildAIUsageReport } from "@/lib/ai/report"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: logs } = await supabase
      .from("ai_logs")
      .select("*")
      .eq("user_id", user.id)

    const report = buildAIUsageReport(logs || [])

    return NextResponse.json({ report })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

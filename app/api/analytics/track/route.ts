ï»¿import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    const body = await req.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await supabase.from("analytics_events").insert({
      user_id: user.id,
      event: body.event || "unknown",
      meta: body.meta || {},
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

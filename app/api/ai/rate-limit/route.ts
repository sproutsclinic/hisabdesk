ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ allowed: false }, { status: 401 })

    const { count } = await supabase
      .from("ai_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    const limit = 100   // stabilization default
    const used = count || 0

    return NextResponse.json({
      allowed: used < limit,
      used,
      limit,
    })
  } catch {
    return NextResponse.json({ allowed: false }, { status: 500 })
  }
}

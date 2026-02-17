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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: logs } = await supabase
      .from("ai_logs")
      .select("tokens, module, created_at")
      .eq("user_id", user.id)

    const totalTokens = (logs || []).reduce(
      (s: number, l: any) => s + Number(l.tokens || 0),
      0
    )

    return NextResponse.json({
      totalCalls: logs?.length || 0,
      totalTokens,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

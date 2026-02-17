ï»¿import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

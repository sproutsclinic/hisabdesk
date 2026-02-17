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
      return NextResponse.json({ status: "unauthorized" }, { status: 401 })

    return NextResponse.json({
      status: "ok",
      message: "AI gateway active",
    })
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}

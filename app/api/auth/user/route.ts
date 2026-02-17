ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user)
      return NextResponse.json({ user: null }, { status: 401 })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}

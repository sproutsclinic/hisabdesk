ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 })
    }

    const { data: me } = await supabase
      .from("profiles")
      .select("referral_used, pro_expires_at")
      .eq("id", user.id)
      .single()

    if (me?.referral_used) {
      return NextResponse.json(
        { error: "Referral already used" },
        { status: 400 }
      )
    }

    const { data: owner } = await supabase
      .from("profiles")
      .select("id, pro_expires_at")
      .eq("referral_code", code)
      .single()

    if (!owner || owner.id === user.id) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      )
    }

    const addOneMonth = (date?: string | null) => {
      const d = date ? new Date(date) : new Date()
      d.setMonth(d.getMonth() + 1)
      return d.toISOString()
    }

    const newUserExpiry = addOneMonth(me?.pro_expires_at)
    const ownerExpiry = addOneMonth(owner?.pro_expires_at)

    await Promise.all([
      supabase
        .from("profiles")
        .update({
          pro_expires_at: newUserExpiry,
          referral_used: true,
          is_pro: true,
        })
        .eq("id", user.id),

      supabase
        .from("profiles")
        .update({
          pro_expires_at: ownerExpiry,
          is_pro: true,
        })
        .eq("id", owner.id),
    ])

    return NextResponse.json({
      success: true,
      message: "Referral applied. 1 month Pro added to both accounts.",
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed" },
      { status: 500 }
    )
  }
}
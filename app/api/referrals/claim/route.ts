import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   REFERRAL CLAIM API — HisabDesk

   POST /api/referrals/claim

   Purpose:
   ✅ apply referral at signup/payment success
   ✅ reward BOTH users
   ✅ add 1 free Pro month each
   ✅ safe (auth required)
   ✅ idempotent (cannot reuse same code twice)

   BODY:
   { code: string }

   DB expected:
   profiles:
     id
     referral_code
     referral_used (bool)
     pro_expires_at (timestamp)

================================================= */

export async function POST(req: Request) {
  try {
    /* ================= AUTH ================= */

    const authHeader = req.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    /* ================= INPUT ================= */

    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 })
    }

    /* ================= LOAD CURRENT USER ================= */

    const { data: me } = await supabase
      .from("profiles")
      .select("referral_used, pro_expires_at")
      .eq("id", user.id)
      .single()

    if (me?.referral_used) {
      return NextResponse.json({ error: "Referral already used" }, { status: 400 })
    }

    /* ================= FIND OWNER ================= */

    const { data: owner } = await supabase
      .from("profiles")
      .select("id, pro_expires_at")
      .eq("referral_code", code)
      .single()

    if (!owner || owner.id === user.id) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 })
    }

    /* ================= REWARD LOGIC ================= */

    const addOneMonth = (date?: string | null) => {
      const d = date ? new Date(date) : new Date()
      d.setMonth(d.getMonth() + 1)
      return d.toISOString()
    }

    const newUserExpiry = addOneMonth(me?.pro_expires_at)
    const ownerExpiry = addOneMonth(owner?.pro_expires_at)

    /* ================= UPDATE BOTH ================= */

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

    /* ================= SUCCESS ================= */

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

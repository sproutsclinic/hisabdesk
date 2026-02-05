import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   PRO RENEWAL NOTIFIER — CRON SAFE

   Route:
   GET /api/pro/notify

   Purpose:
   ✅ runs daily (cron)
   ✅ finds users expiring soon
   ✅ creates reminder notifications
   ✅ future ready for:
      → email
      → whatsapp
      → push

================================================= */

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const today = new Date()
    const in7 = new Date()
    in7.setDate(today.getDate() + 7)

    /* ================= FIND EXPIRING USERS ================= */

    const { data: users } = await supabase
      .from("profiles")
      .select("id, email, pro_expires_at, is_pro")
      .eq("is_pro", true)
      .lte("pro_expires_at", in7.toISOString())

    if (!users?.length) {
      return NextResponse.json({ ok: true, count: 0 })
    }

    /* ================= CREATE NOTIFICATIONS ================= */

    const rows = users.map((u) => {
      const daysLeft = Math.ceil(
        (new Date(u.pro_expires_at).getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      )

      return {
        user_id: u.id,
        type: "pro_expiry",
        message:
          daysLeft > 0
            ? `Your Pro expires in ${daysLeft} day(s). Renew to keep AI features.`
            : "Your Pro has expired. Renew to unlock features again.",
        created_at: new Date().toISOString(),
      }
    })

    await supabase.from("notifications").insert(rows)

    return NextResponse.json({ ok: true, count: rows.length })
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}

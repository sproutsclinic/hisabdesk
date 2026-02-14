import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   WHATSAPP RENEWAL NOTIFIER — ENTERPRISE RETENTION

   Route:
   POST /api/pro/renewal-whatsapp

   Purpose:
   ✅ send WhatsApp reminders for expiring Pro users
   ✅ runs via cron or manual trigger
   ✅ future-ready (Interakt / Twilio / Gupshup)
   ✅ safe + server side only

   ENV REQUIRED:
   WHATSAPP_API_KEY
   WHATSAPP_API_URL

   NOTE:
   Replace fetch() with your provider API format
================================================= */

export async function POST(req: Request) {
  try {
    /* 🔒 CRON AUTH (same secret as other jobs) */
    const auth = req.headers.get("authorization")

    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const today = new Date()
    const in3 = new Date()
    in3.setDate(today.getDate() + 3)

    /* ================= FIND USERS EXPIRING SOON ================= */

    const { data: users } = await supabase
      .from("profiles")
      .select("id, phone, pro_expires_at, is_pro")
      .eq("is_pro", true)
      .lte("pro_expires_at", in3.toISOString())
      .gte("pro_expires_at", today.toISOString())

    if (!users?.length) {
      return NextResponse.json({ ok: true, count: 0 })
    }

    /* ================= SEND WHATSAPP ================= */

    let sent = 0

    for (const u of users) {
      if (!u.phone) continue

      const daysLeft = Math.ceil(
        (new Date(u.pro_expires_at).getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      )

      const message = `Hi 👋 Your HisabDesk Pro expires in ${daysLeft} day(s).
Renew now to keep AI tax insights active:
https://hisabdesk.com/billing`

      /* 🔁 Replace with your provider */
      await fetch(process.env.WHATSAPP_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
        },
        body: JSON.stringify({
          to: u.phone,
          message,
        }),
      })

      sent++
    }

    return NextResponse.json({ ok: true, count: sent })
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}

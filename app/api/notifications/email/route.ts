import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   EMAIL NOTIFICATION API — Phase 12 (Enterprise)

   POST /api/notifications/email

   Purpose:
   ✅ send transactional emails
   ✅ renewal reminders
   ✅ referral rewards
   ✅ future: invoices / reports

   Provider:
   Resend (recommended)

   ENV REQUIRED:
   RESEND_API_KEY

================================================= */

export async function POST(req: Request) {
  try {
    /* ================= AUTH (CRON OR SERVER) ================= */

    const auth = req.headers.get("authorization")

    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    /* ================= BODY ================= */

    const { to, subject, html } = await req.json()

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    /* ================= SEND EMAIL (Resend REST) ================= */

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HisabDesk <noreply@hisabdesk.com>",
        to,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Email failed" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "failed" },
      { status: 500 }
    )
  }
}

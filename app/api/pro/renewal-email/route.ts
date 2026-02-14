import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   PRO RENEWAL EMAIL SENDER — CRON SAFE

   Route:
   GET /api/pro/renewal-email

   Purpose:
   ✅ daily cron email reminders
   ✅ sends only if expiry ≤ 7 days
   ✅ uses Resend
   ✅ protected by CRON_SECRET
   ✅ enterprise safe

   ENV REQUIRED:
   CRON_SECRET
   RESEND_API_KEY
================================================= */

export async function GET(req: Request) {
  try {
    /* 🔒 CRON AUTH */
    const auth = req.headers.get("authorization")

    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const today = new Date()
    const in7 = new Date()
    in7.setDate(today.getDate() + 7)

    /* ================= USERS ================= */

    const { data: users } = await supabase
      .from("profiles")
      .select("id, email, pro_expires_at, is_pro")
      .eq("is_pro", true)
      .lte("pro_expires_at", in7.toISOString())
      .gte("pro_expires_at", today.toISOString())

    if (!users?.length) {
      return NextResponse.json({ ok: true, sent: 0 })
    }

    /* ================= RESEND ================= */

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HisabDesk <support@hisabdesk.com>",
        to: users.map((u) => u.email),
        subject: "Your HisabDesk Pro expires soon",
        html: `
          <div style="font-family:Inter,Arial;padding:24px">
            <h2>Your Pro plan is expiring soon</h2>
            <p>Renew now to keep AI tax tools and reports active.</p>
            <a href="https://hisabdesk.com/billing"
               style="background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">
               Renew Now
            </a>
            <p style="margin-top:20px;font-size:12px;color:#666">
              — HisabDesk Team
            </p>
          </div>
        `,
      }),
    })

    if (!resendRes.ok) {
      return NextResponse.json({ error: "Email failed" }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      sent: users.length,
    })
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}

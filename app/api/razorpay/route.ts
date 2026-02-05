import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   RAZORPAY WEBHOOK — AUTO PRO ACTIVATION

   Route:
   POST /api/razorpay/webhook

   Purpose:
   ✅ verifies Razorpay signature
   ✅ activates PRO automatically
   ✅ updates profiles.is_pro = true

   Requires:
   RAZORPAY_WEBHOOK_SECRET in .env.local

================================================= */

export async function POST(req: Request) {
  try {
    /* ================= RAW BODY ================= */

    const rawBody = await req.text()

    const signature =
      req.headers.get("x-razorpay-signature") || ""

    /* ================= VERIFY ================= */

    const expected = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET!
      )
      .update(rawBody)
      .digest("hex")

    if (signature !== expected) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      )
    }

    const body = JSON.parse(rawBody)
    const event = body.event

    /* ================= ONLY SUCCESS EVENTS ================= */

    const allowed = [
      "subscription.activated",
      "subscription.charged",
      "payment.captured",
    ]

    if (!allowed.includes(event)) {
      return NextResponse.json({ ok: true })
    }

    /* ================= GET USER ID ================= */

    const userId =
      body.payload?.subscription?.entity?.notes?.userId ||
      body.payload?.payment?.entity?.notes?.userId

    if (!userId) {
      return NextResponse.json({ ok: true })
    }

    /* ================= SUPABASE ================= */

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    /* ================= ACTIVATE PRO ================= */

    await supabase
      .from("profiles")
      .update({ is_pro: true })
      .eq("id", userId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    )
  }
}

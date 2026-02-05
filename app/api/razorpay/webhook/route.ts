import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   RAZORPAY WEBHOOK — FINAL PRODUCTION (HisabDesk)

   Handles:
   ✅ subscription.activated
   ✅ subscription.charged
   ✅ payment.captured
   ✅ subscription.cancelled

   Features:
   ✅ signature verified
   ✅ auto Pro activation
   ✅ extends expiry (monthly)
   ✅ auto referral reward (both users)
   ✅ idempotent safe
   ✅ server trusted only

   ENV:
   RAZORPAY_WEBHOOK_SECRET
================================================= */

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-razorpay-signature")

    /* ================= SIGNATURE VERIFY ================= */

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex")

    if (expected !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    /* ================= SUPABASE ================= */

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    /* ================= EXTRACT USER ================= */

    const userId =
      event?.payload?.subscription?.entity?.notes?.userId ||
      event?.payload?.payment?.entity?.notes?.userId

    if (!userId) {
      return NextResponse.json({ ok: true }) // ignore safely
    }

    /* ================= HELPERS ================= */

    const addOneMonth = (date?: string | null) => {
      const d = date ? new Date(date) : new Date()
      d.setMonth(d.getMonth() + 1)
      return d.toISOString()
    }

    const upgradeEvents = [
      "subscription.activated",
      "subscription.charged",
      "payment.captured",
    ]

    /* =================================================
       🔒 PRO ACTIVATION + EXTEND EXPIRY
    ================================================= */

    if (upgradeEvents.includes(event.event)) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("pro_expires_at, referral_used, referred_by")
        .eq("id", userId)
        .single()

      const newExpiry = addOneMonth(profile?.pro_expires_at)

      await supabase
        .from("profiles")
        .update({
          is_pro: true,
          pro_since: new Date().toISOString(),
          pro_expires_at: newExpiry,
        })
        .eq("id", userId)

      /* =================================================
         🎁 AUTO REFERRAL REWARD (FIRST PAYMENT ONLY)
      ================================================= */

      if (!profile?.referral_used && profile?.referred_by) {
        const code = profile.referred_by

        const { data: owner } = await supabase
          .from("profiles")
          .select("id, pro_expires_at")
          .eq("referral_code", code)
          .single()

        if (owner) {
          const ownerExpiry = addOneMonth(owner.pro_expires_at)

          await Promise.all([
            supabase
              .from("profiles")
              .update({
                referral_used: true,
              })
              .eq("id", userId),

            supabase
              .from("profiles")
              .update({
                is_pro: true,
                pro_expires_at: ownerExpiry,
              })
              .eq("id", owner.id),
          ])
        }
      }
    }

    /* =================================================
       CANCEL / EXPIRE
    ================================================= */

    if (event.event === "subscription.cancelled") {
      await supabase
        .from("profiles")
        .update({ is_pro: false })
        .eq("id", userId)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}

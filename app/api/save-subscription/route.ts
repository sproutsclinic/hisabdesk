ï»¿import { NextResponse } from "next/server"
import crypto from "crypto"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

/* ========================================
   RAZORPAY WEBHOOK â€” FINAL (NO createClient)
======================================== */

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin()

    const rawBody = await req.text()

    /* =============================
       VERIFY SIGNATURE (MANDATORY)
    ============================== */

    const signature = req.headers.get("x-razorpay-signature")

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex")

    if (!signature || signature !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    /* =============================
       SUBSCRIPTION SUCCESS
    ============================== */

    if (event.event === "subscription.charged") {
      const userId = event?.payload?.subscription?.entity?.notes?.userId

      if (userId) {
        await supabase
          .from("profiles")
          .update({ is_pro: true })
          .eq("id", userId)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
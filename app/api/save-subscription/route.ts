import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

/* ========================================
   SERVER ONLY SUPABASE CLIENT
   (service role key required)
======================================== */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ========================================
   RAZORPAY WEBHOOK
   POST /api/save-subscription
======================================== */

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()

    /* =============================
       VERIFY SIGNATURE (MANDATORY)
    ============================== */

    const signature = req.headers.get("x-razorpay-signature")!

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex")

    if (signature !== expected) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    const event = JSON.parse(rawBody)

    /* =============================
       SUBSCRIPTION SUCCESS
    ============================== */

    if (event.event === "subscription.charged") {
      const userId =
        event.payload.subscription.entity.notes.userId

      /* 🔥 mark user pro */
      await supabase
        .from("profiles")
        .update({ is_pro: true })
        .eq("id", userId)
    }

    return NextResponse.json({ ok: true })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}

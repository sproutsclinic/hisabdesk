ï»¿/**
 * =========================================================
 * Billing Portal API (Customer Self-Serve Management)
 * HisabDesk â€” Subscription Management Endpoint
 * =========================================================
 */

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import Razorpay from "razorpay"

/* =========================================================
   RAZORPAY CLIENT
========================================================= */

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

/* =========================================================
   POST
========================================================= */

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin()

    const token =
      req.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* verify user */
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (!user || error) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* fetch stored subscription id */
    const { data: profile } = await supabase
      .from("profiles")
      .select("razorpay_subscription_id")
      .eq("id", user.id)
      .single()

    if (!profile?.razorpay_subscription_id) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      )
    }

    const razorpay = getRazorpay()

    /* verify subscription exists */
    const sub = await razorpay.subscriptions.fetch(
      profile.razorpay_subscription_id
    )

    if (!sub?.id) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 400 }
      )
    }

    const url = `https://dashboard.razorpay.com/app/subscriptions/${sub.id}`

    return NextResponse.json({ url })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Portal failed" },
      { status: 500 }
    )
  }
}

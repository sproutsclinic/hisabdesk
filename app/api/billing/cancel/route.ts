/**
 * =========================================================
 * Cancel Subscription API
 * HisabDesk – Billing Cancellation Endpoint
 * =========================================================
 *
 * ROUTE
 *   POST /api/billing/cancel
 *
 * PURPOSE
 * Allows user to:
 *   ✓ cancel Razorpay subscription safely
 *   ✓ downgrade to Free
 *   ✓ keep DB in sync
 *
 * FLOW
 *   UI → confirm modal → call this API
 *   → Razorpay cancel
 *   → update profile
 *
 * SECURITY
 *   ✓ server only
 *   ✓ auth required
 *   ✓ service role
 *
 * =========================================================
 */

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Razorpay from "razorpay"
import { cancelPro } from "@/lib/billing/subscription-sync"

/* =========================================================
   CLIENTS
========================================================= */

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

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
    const supabase = getSupabase()

    const token =
      req.headers.get("authorization")?.replace(
        "Bearer ",
        ""
      )

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

    /* get subscription id */
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

    /* cancel at Razorpay */
    await razorpay.subscriptions.cancel(
      profile.razorpay_subscription_id
    )

    /* sync DB */
    await cancelPro(user.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Cancel failed" },
      { status: 500 }
    )
  }
}

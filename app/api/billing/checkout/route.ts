/**
 * =========================================================
 * Billing Checkout API
 * HisabDesk – Razorpay Subscription Creator
 * =========================================================
 *
 * ROUTE
 *   POST /api/billing/checkout
 *
 * PURPOSE
 * Server endpoint to:
 *   ✓ create Razorpay subscription
 *   ✓ return hosted checkout URL
 *
 * FLOW
 *   UI → call this API → redirect to returned URL
 *
 * SECURITY
 *   ✓ server only
 *   ✓ uses service role
 *   ✓ never expose Razorpay secret in client
 *
 * =========================================================
 */

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createCheckout } from "@/lib/billing/razorpay-portal"

/* =========================================================
   CLIENT
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   POST
========================================================= */

export async function POST(req: Request) {
  try {
    const supabase = getClient()

    /* get auth header */
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

    /* create checkout */
    const url = await createCheckout({
      userId: user.id,
      email: user.email || "",
      name: user.user_metadata?.full_name,
    })

    return NextResponse.json({ url })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    )
  }
}

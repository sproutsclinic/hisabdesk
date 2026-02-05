import { NextResponse } from "next/server"
import { razorpay } from "@/lib/razorpay"

/* ========================================
   CREATE SUBSCRIPTION
   POST /api/razorpay
======================================== */

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    /* 🔒 safety check */
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      )
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID!,
      total_count: 12,
      customer_notify: 1,

      /* 🔥 used by webhook */
      notes: {
        userId
      }
    })

    return NextResponse.json({
      id: subscription.id
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}

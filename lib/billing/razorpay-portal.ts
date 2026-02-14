"use server"

/**
 * =========================================================
 * Razorpay Customer Portal Helper
 * HisabDesk – Billing Management Layer
 * =========================================================
 *
 * PURPOSE
 * Central helper to:
 *
 *   ✓ create subscriptions
 *   ✓ generate checkout link
 *   ✓ open Razorpay hosted billing
 *   ✓ manage upgrades/cancellations
 *
 * WHY
 * ---------------------------------------------------------
 * Never scatter Razorpay logic across UI.
 * Keep ALL billing provider logic here.
 *
 * =========================================================
 *
 * ENV REQUIRED
 *
 * RAZORPAY_KEY_ID
 * RAZORPAY_KEY_SECRET
 * RAZORPAY_PRO_PLAN_ID
 *
 * =========================================================
 *
 * USAGE (server action / API)
 *
 * const url = await createCheckout({
 *   userId,
 *   email
 * })
 *
 * redirect(url)
 *
 * =========================================================
 *
 * SAFE
 * - server only
 * - uses secret key
 * =========================================================
 */

import Razorpay from "razorpay"

/* =========================================================
   CLIENT
========================================================= */

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

/* =========================================================
   TYPES
========================================================= */

type CheckoutInput = {
  userId: string
  email: string
  name?: string
}

/* =========================================================
   CREATE CHECKOUT (SUBSCRIPTION)
========================================================= */

export async function createCheckout(
  input: CheckoutInput
): Promise<string> {
  const razorpay = getRazorpay()

  const subscription =
    await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PRO_PLAN_ID!,
      customer_notify: 1,
      quantity: 1,
      notes: {
        userId: input.userId,
      },
    })

  /**
   * Razorpay hosted checkout URL
   */
  const url = `https://api.razorpay.com/v1/subscriptions/${subscription.id}/checkout`

  return url
}

/* =========================================================
   CREATE PAYMENT LINK (fallback method)
========================================================= */

export async function createPaymentLink(
  input: CheckoutInput
): Promise<string> {
  const razorpay = getRazorpay()

  const link = await razorpay.paymentLink.create({
    amount: 49900, // ₹499
    currency: "INR",
    description: "HisabDesk Pro Subscription",
    customer: {
      email: input.email,
      name: input.name,
    },
    notify: {
      email: true,
    },
    notes: {
      userId: input.userId,
    },
  })

  return link.short_url
}

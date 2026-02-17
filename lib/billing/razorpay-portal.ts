ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Razorpay Billing Portal
   Proper Subscription Checkout (SDK Correct Version)
   ========================================================= */

import Razorpay from "razorpay"

/* =========================================================
   CLIENT
   ========================================================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

/* =========================================================
   TYPES
   ========================================================= */

interface CheckoutInput {
  userId: string
  email: string
  name?: string
}

/* =========================================================
   CREATE CHECKOUT
   This creates a Subscription and returns Checkout payload.
   Frontend will open Razorpay Checkout using this data.
   ========================================================= */

export async function createCheckout(input: CheckoutInput) {
  // -------------------------------------------------------
  // Create Subscription
  // -------------------------------------------------------

  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PRO_PLAN_ID!,
    total_count: 1200, // 100 years (effectively recurring)
    quantity: 1,
    customer_notify: 1,
    notes: {
      userId: input.userId,
    },
  })

  // -------------------------------------------------------
  // Return Checkout Config (NOT a URL)
  // Frontend opens Razorpay modal using this.
  // -------------------------------------------------------

  return {
    key: process.env.RAZORPAY_KEY_ID!,
    subscriptionId: subscription.id,
    customer: {
      name: input.name || "User",
      email: input.email,
    },
  }
}

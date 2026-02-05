import Razorpay from "razorpay"

/* ========================================
   SERVER ONLY RAZORPAY CLIENT
   Used by API routes only
======================================== */

/* 🔒 prevent client-side usage */
if (typeof window !== "undefined") {
  throw new Error("razorpay.ts must only be used on server")
}

/* 🔒 validate env */
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay env keys")
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

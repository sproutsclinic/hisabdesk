ï»¿// app/api/razorpay/route.ts

import { NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const plan = searchParams.get("plan")

  const prices: Record<string, number> = {
    personal: 19900,
    business: 49900,
    ca: 149900,
  }

  const amount = prices[plan || ""]

  if (!amount) {
    return new NextResponse("Invalid plan", { status: 400 })
  }

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
  })

  const html = `
  <html>
    <body>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <script>
        const options = {
          key: "${process.env.RAZORPAY_KEY_ID}",
          order_id: "${order.id}",
          handler: function () {
            window.location.href = "/(personal)/onboarding";
          }
        };

        new Razorpay(options).open();
      </script>
    </body>
  </html>
  `

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  })
}

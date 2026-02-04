import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  const { userId, subscriptionId } = body

  await supabase.from("subscriptions").insert({
    user_id: userId,
    razorpay_subscription_id: subscriptionId,
    status: "active"
  })

  return NextResponse.json({ success: true })
}

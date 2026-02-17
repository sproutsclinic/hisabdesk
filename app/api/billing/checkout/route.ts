ï»¿import { NextResponse } from "next/server"
import { createCheckout } from "@/lib/billing/razorpay-portal"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !user.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const session = await createCheckout({
      userId: user.id,
      email: user.email,
    })

    // Razorpay returns config object, not URL
    return NextResponse.json({
      key: session.key,
      subscriptionId: session.subscriptionId,
      customer: session.customer,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    // ======================
    // Check logged in user
    // ======================
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // ======================
    // Check subscription
    // ======================
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userData.user.id)
      .single()

    if (!sub) {
      return NextResponse.json(
        { error: "Pro only feature" },
        { status: 403 }
      )
    }

    // ======================
    // Get request data
    // ======================
    const body = await req.json()

    const { income, expense, profit, oldTax, newTax, adaTax } = body

    const prompt = `
You are an Indian tax advisor.

User data:
Income: ₹${income}
Expense: ₹${expense}
Profit: ₹${profit}
Old tax: ₹${oldTax}
New tax: ₹${newTax}
44ADA tax: ₹${adaTax}

Give 5 short actionable tax saving tips.
Be simple. Bullet points only.
`

    // ======================
    // OpenAI call
    // ======================
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    })

    const advice = response.choices[0].message.content

    return NextResponse.json({ advice })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "AI processing failed" },
      { status: 500 }
    )
  }
}

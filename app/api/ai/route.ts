import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
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

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: prompt }
    ]
  })

  const advice = response.choices[0].message.content

  return NextResponse.json({ advice })
}

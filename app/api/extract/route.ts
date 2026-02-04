import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { fileName } = await req.json()

    // ======================
    // Download file
    // ======================
    const { data } = await supabase.storage
      .from("documents")
      .download(`bank/${fileName}`)

    if (!data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const buffer = Buffer.from(await data.arrayBuffer())

    // ======================
    // ✅ SAFEST dynamic import (Next 16 compatible)
    // ======================
    const pdfModule: any = await import("pdf-parse")
    const parsed = await pdfModule.default(buffer)

    const lines = parsed.text.split("\n")

    const transactions: any[] = []

    // ======================
    // REGEX PARSE
    // ======================
    lines.forEach((line: string) => {
      const match = line.match(/(\d{2}\/\d{2}\/\d{2,4}).*?(-?\d+(\.\d+)?)/)

      if (!match) return

      const amount = Number(match[2])

      transactions.push({
        date: match[1],
        amount: Math.abs(amount),
        type: amount < 0 ? "expense" : "income",
        note: line.slice(0, 60),
      })
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "PDF extraction failed" },
      { status: 500 }
    )
  }
}

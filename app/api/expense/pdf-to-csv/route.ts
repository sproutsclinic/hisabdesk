// ==========================================================
// Expense PDF → Text Extract API
// Server side only (pdf-parse)
// ==========================================================

import { NextResponse } from "next/server"
import pdf from "pdf-parse"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File

    const buffer = Buffer.from(await file.arrayBuffer())

    const data = await pdf(buffer)

    return NextResponse.json({
      text: data.text,
    })
  } catch {
    return NextResponse.json(
      { error: "PDF parse failed" },
      { status: 500 }
    )
  }
}

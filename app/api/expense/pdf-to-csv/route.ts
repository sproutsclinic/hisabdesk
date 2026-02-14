// ==========================================================
// Expense PDF → Text Extract API
// Server side only (pdf-parse)
// Next.js 16 compatible (dynamic import fix)
// ==========================================================

import { NextResponse } from "next/server"

// ----------------------------------------------------------
// pdf-parse MUST be dynamically imported in Next 16
// (because it is CommonJS, not ESM)
// ----------------------------------------------------------
async function parsePdf(buffer: Buffer) {
  const pdfParse = (await import("pdf-parse")).default
  return pdfParse(buffer)
}

// ----------------------------------------------------------
// POST
// ----------------------------------------------------------
export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const data = await parsePdf(buffer)

    return NextResponse.json({
      text: data.text,
    })
  } catch (err) {
    console.error("PDF parse failed:", err)

    return NextResponse.json(
      { error: "PDF parse failed" },
      { status: 500 }
    )
  }
}
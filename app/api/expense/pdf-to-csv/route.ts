ï»¿// ==========================================================
// Expense PDF ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Text Extract API
// Server side only (pdf-parse)
// Next.js 16 + Turbopack SAFE version
// ==========================================================

import { NextResponse } from "next/server"

export const runtime = "nodejs"          // REQUIRED (pdf-parse cannot run on Edge)
export const dynamic = "force-dynamic"   // avoid caching issues

// ----------------------------------------------------------
// pdf-parse must be dynamically imported in Next 16
// It is now ESM-compatible but export shape varies by bundler
// This normalizes the function safely.
// ----------------------------------------------------------
async function parsePdf(buffer: Buffer) {
  const mod = await import("pdf-parse")

  // Turbopack / Node may expose function differently
  const pdfParse: any = (mod as any).default ?? mod

  return pdfParse(buffer)
}

// ----------------------------------------------------------
// POST
// ----------------------------------------------------------
export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const data = await parsePdf(buffer)

    return NextResponse.json({
      text: data?.text ?? "",
    })
  } catch (err) {
    console.error("PDF parse failed:", err)

    return NextResponse.json(
      { error: "PDF parse failed" },
      { status: 500 }
    )
  }
}

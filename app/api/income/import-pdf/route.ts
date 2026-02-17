ï»¿import { NextRequest, NextResponse } from "next/server"

/* =========================================================
   IMPORTANT ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â This route MUST run in Node runtime
   because pdf-parse uses Buffer + fs internals.
========================================================= */
export const runtime = "nodejs"
export const dynamic = "force-dynamic" // prevents Turbopack caching issues

/* =========================================================
   Dynamically import pdf-parse (CJS/ESM bridge safe)
   Required for Next.js 16 + Turbopack compatibility
========================================================= */
async function parsePdf(buffer: Buffer) {
  const mod = await import("pdf-parse")

  // normalize export (Turbopack sometimes exposes default, sometimes not)
  const pdfParse: any = (mod as any).default ?? mod

  return pdfParse(buffer)
}

/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â PDF ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Income Extractor (Digital PDFs only)
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ server side
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ no OCR
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ deterministic
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ extracts CREDIT rows only
========================================================= */

type Row = {
  date: string
  description: string
  amount: number
}

/* ========================================================= */

function parseLines(text: string): Row[] {
  const rows: Row[] = []

  const lines = text.split("\n").map((l) => l.trim())

  for (const line of lines) {
    const hasCredit = /credit|cr|deposit/i.test(line)
    if (!hasCredit) continue

    const dateMatch = line.match(/\d{2}[\/-]\d{2}[\/-]\d{2,4}/)

    const amountMatch = line.match(/(\d{1,3}(,\d{3})*(\.\d{2})?)$/)

    if (!dateMatch || !amountMatch) continue

    const date = dateMatch[0]

    const amount = Number(amountMatch[0].replace(/,/g, ""))

    const description = line
      .replace(date, "")
      .replace(amountMatch[0], "")
      .trim()

    if (amount > 0) {
      rows.push({
        date,
        description,
        amount,
      })
    }
  }

  return rows
}

/* ========================================================= */

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file) {
      return NextResponse.json([], { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const data = await parsePdf(buffer)

    const rows = parseLines(data?.text ?? "")

    return NextResponse.json(rows)
  } catch (err) {
    console.error("PDF import failed:", err)
    return NextResponse.json([], { status: 500 })
  }
}

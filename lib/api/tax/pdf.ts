/* =========================================================
   HisabDesk — Tax PDF Builder
   ---------------------------------------------------------
   PURPOSE
   - Convert tax result → downloadable PDF
   - Used by:
        /api/tax/export?type=pdf
   - PURE builder only

   RULES
   ✅ No DB
   ✅ No AI
   ✅ No business logic
   ✅ Deterministic
   ✅ Server safe

   NOTE
   ---------------------------------------------------------
   We intentionally avoid heavy PDF libraries to keep:
   - serverless friendly
   - zero dependencies
   - fast cold starts

   This creates a lightweight text-based PDF using the
   minimal PDF spec (works in all viewers).

   If later you want rich styling:
   → swap with puppeteer/html or pdf-lib

   ========================================================= */

import type { TaxComputationResult } from "./types"
import { buildTaxReportRows } from "./report"

/* =========================================================
   PUBLIC
   ========================================================= */

export function buildTaxPDF(
  result: TaxComputationResult,
  financialYear: string,
): Buffer {
  const rows = buildTaxReportRows(result)

  const lines: string[] = []

  lines.push("HisabDesk — Tax Summary")
  lines.push(`Financial Year: ${financialYear}`)
  lines.push(" ")
  lines.push("----------------------------------------")

  for (const r of rows) {
    lines.push(`${r.label}: ${r.value}`)
  }

  lines.push("----------------------------------------")

  const text = lines.join("\n")

  return createSimplePDF(text)
}

/* =========================================================
   INTERNAL — Minimal PDF generator
   ---------------------------------------------------------
   Generates a valid PDF with monospaced text
   No external libs required
   ========================================================= */

function createSimplePDF(text: string): Buffer {
  const safeText = text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")

  const contentStream = `
BT
/F1 10 Tf
14 TL
50 780 Td
(${safeText.split("\n").join(") Tj T* (")}) Tj
ET
`

  const objects: string[] = []

  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj")
  objects.push("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj")
  objects.push(
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
  )
  objects.push(
    `4 0 obj << /Length ${contentStream.length} >> stream
${contentStream}
endstream endobj`,
  )
  objects.push("5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj")

  let offset = 0
  const xref: number[] = []

  let body = "%PDF-1.4\n"

  for (const obj of objects) {
    xref.push(offset)
    body += obj + "\n"
    offset = Buffer.byteLength(body)
  }

  const xrefStart = offset

  body += `xref
0 ${objects.length + 1}
0000000000 65535 f \n`

  for (const x of xref) {
    body += `${String(x).padStart(10, "0")} 00000 n \n`
  }

  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefStart}
%%EOF`

  return Buffer.from(body, "utf-8")
}

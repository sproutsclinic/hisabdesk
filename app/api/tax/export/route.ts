/* =========================================================
   HisabDesk — Tax Export API
   ---------------------------------------------------------
   PURPOSE
   - Export latest tax calculation
   - CSV download
   - PDF download (NEW)

   ARCHITECTURE
     Client → /api/tax/export
            → service (DB fetch)
            → report/pdf builder
            → file response

   RULES
   ✅ Server only
   ✅ No calculations here
   ✅ No AI
   ✅ No business logic
   ❌ No client trust
   ❌ No OpenAI

   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { getLatestTaxCalculation } from "@/lib/api/tax/service"
import { buildTaxCSV } from "@/lib/api/tax/report"

/* ✅ NEW */
import { buildTaxPDF } from "@/lib/api/tax/pdf"

/* =========================================================
   AUTH CLIENT (session based)
   ========================================================= */

function getServerClient(req: NextRequest) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") || "",
        },
      },
    },
  )
}

/* =========================================================
   GET /api/tax/export?fy=2024-25&type=csv|pdf
   ========================================================= */

export async function GET(req: NextRequest) {
  try {
    const supabase = getServerClient(req)

    /* -----------------------------------------------------
       AUTH
       ----------------------------------------------------- */
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    /* -----------------------------------------------------
       QUERY
       ----------------------------------------------------- */
    const { searchParams } = new URL(req.url)

    const financialYear = searchParams.get("fy") || "2024-25"
    const type = searchParams.get("type") || "csv"

    /* -----------------------------------------------------
       LOAD LATEST RESULT
       ----------------------------------------------------- */
    const latest = await getLatestTaxCalculation(user.id, financialYear)

    if (!latest) {
      return NextResponse.json(
        { error: "No tax calculation found" },
        { status: 404 },
      )
    }

    /* =====================================================
       CSV EXPORT (unchanged)
       ===================================================== */
    if (type === "csv") {
      const csv = buildTaxCSV(latest.result)

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="tax-${financialYear}.csv"`,
        },
      })
    }

    /* =====================================================
       ✅ PDF EXPORT (NEW)
       ===================================================== */
    if (type === "pdf") {
      const pdfBuffer = buildTaxPDF(latest.result, financialYear)

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="tax-${financialYear}.pdf"`,
        },
      })
    }

    /* -----------------------------------------------------
       INVALID TYPE
       ----------------------------------------------------- */
    return NextResponse.json(
      { error: "Unsupported export type" },
      { status: 400 },
    )
  } catch (err) {
    console.error("Tax export error:", err)

    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 },
    )
  }
}

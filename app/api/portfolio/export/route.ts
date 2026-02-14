/* =========================================================
   HisabDesk — Portfolio Export API
   ---------------------------------------------------------
   SERVER ROUTE ONLY

   PURPOSE
   - Export portfolio as CSV
   - Uses:
       ✓ DB (service)
       ✓ engine computed values
       ✓ report formatter
   - No calculations here

   ARCHITECTURE
     client
       ↓
     /api/portfolio/export
       ↓
     service (load overview)
       ↓
     report.ts (format)
       ↓
     file response

   RULES
   ✅ server only
   ✅ no business logic
   ✅ no AI
   ❌ no math
   ❌ no client trust

   ENDPOINT
     GET /api/portfolio/export?type=csv

   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { getPortfolioOverview } from "@/lib/api/portfolio/service"
import { buildPortfolioCSV } from "@/lib/api/portfolio/report"

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

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/* =========================================================
   GET /api/portfolio/export
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

    if (error || !user) return bad("Unauthorized", 401)

    /* -----------------------------------------------------
       QUERY
       ----------------------------------------------------- */
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "csv"

    /* -----------------------------------------------------
       LOAD OVERVIEW (SERVER AUTHORITY)
       ----------------------------------------------------- */
    const overview = await getPortfolioOverview(user.id)

    if (!overview) {
      return bad("No portfolio found", 404)
    }

    /* -----------------------------------------------------
       CSV
       ----------------------------------------------------- */
    if (type === "csv") {
      const csv = buildPortfolioCSV(overview)

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition":
            'attachment; filename="portfolio.csv"',
        },
      })
    }

    /* -----------------------------------------------------
       FUTURE: PDF
       ----------------------------------------------------- */
    return bad("Unsupported export type")
  } catch (err) {
    console.error("Portfolio export error:", err)

    return bad("Export failed", 500)
  }
}

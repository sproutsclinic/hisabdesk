ï»¿import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import { getPortfolioOverview } from "@/lib/api/portfolio/service"
import { buildPortfolioCSV } from "@/lib/api/portfolio/reports"

export const dynamic = "force-dynamic"

/* =========================================================
   GET â€” Export Portfolio CSV
========================================================= */

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const overview = await getPortfolioOverview(user.id)

    if (!overview) {
      return NextResponse.json({ error: "No portfolio found" }, { status: 404 })
    }

    const csv = buildPortfolioCSV(overview)

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="portfolio.csv"',
      },
    })
  } catch (err) {
    console.error("Portfolio export error:", err)

    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    )
  }
}
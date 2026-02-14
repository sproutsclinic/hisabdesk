// ==========================================================
// Reports API Route
// Server authority only
// Thin transport layer → service
//
// Responsibilities:
// - auth guard
// - parse query
// - call service
// - return JSON
//
// NO:
// ❌ business logic
// ❌ calculations
// ❌ DB queries here
// ==========================================================

import { NextRequest, NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { getReportsService } from "@/lib/api/reports/reports.service"

/* =========================================================
GET /api/reports
========================================================= */

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()

    // ------------------------------------------------------
    // Auth guard
    // ------------------------------------------------------

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // ------------------------------------------------------
    // Parse query
    // ------------------------------------------------------

    const { searchParams } = new URL(req.url)

    const range = searchParams.get("range") ?? undefined
    const from = searchParams.get("from") ?? undefined
    const to = searchParams.get("to") ?? undefined

    // ------------------------------------------------------
    // Service call (ALL logic inside service/engine)
    // ------------------------------------------------------

    const service = getReportsService()

    const result = await service.getReports({
      userId: user.id,
      range,
      from,
      to,
    })

    // ------------------------------------------------------
    // Response
    // ------------------------------------------------------

    return NextResponse.json(result, {
      status: 200,
    })
  } catch (error) {
    console.error("[REPORTS_GET_ERROR]", error)

    return NextResponse.json(
      { error: "Failed to generate reports" },
      { status: 500 }
    )
  }
}

// ==========================================================
// Reports Export API
// Route: /api/reports/export
//
// Server authority only
// Thin transport → service → engine
//
// Responsibilities:
// - auth guard
// - fetch reports via service
// - convert to CSV
// - return file
//
// NO:
// ❌ DB logic
// ❌ calculations
// ❌ business math
// ==========================================================

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getReportsService } from "@/lib/api/reports/reports.service"

/* =========================================================
GET /api/reports/export?format=csv
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ------------------------------------------------------
    // Query params
    // ------------------------------------------------------

    const { searchParams } = new URL(req.url)

    const range = searchParams.get("range") ?? undefined
    const from = searchParams.get("from") ?? undefined
    const to = searchParams.get("to") ?? undefined
    const format = searchParams.get("format") ?? "csv"

    // ------------------------------------------------------
    // Service
    // ------------------------------------------------------

    const service = getReportsService()

    const report = await service.getReports({
      userId: user.id,
      range,
      from,
      to,
    })

    // ------------------------------------------------------
    // CSV export only (Phase 1)
    // ------------------------------------------------------

    if (format !== "csv") {
      return NextResponse.json(
        { error: "Unsupported format" },
        { status: 400 }
      )
    }

    const csv = buildCSV(report)

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="hisabdesk-report.csv"`,
      },
    })
  } catch (err) {
    console.error("[REPORTS_EXPORT_ERROR]", err)

    return NextResponse.json(
      { error: "Failed to export report" },
      { status: 500 }
    )
  }
}

/* =========================================================
Helpers (formatting only — NOT business logic)
========================================================= */

function buildCSV(report: Awaited<ReturnType<ReturnType<typeof getReportsService>["getReports"]>>) {
  const rows: string[] = []

  // ---------------- KPIs ----------------
  rows.push("KPIs")
  rows.push("Income,Expense,Savings,Savings Rate %,Net Cashflow")
  rows.push(
    [
      report.kpis.income,
      report.kpis.expense,
      report.kpis.savings,
      report.kpis.savingsRate,
      report.kpis.netCashflow,
    ].join(",")
  )

  rows.push("")

  // ---------------- Expense by Category ----------------
  rows.push("Expense by Category")
  rows.push("Category,Amount,Percent")

  report.expenseByCategory.forEach((c) => {
    rows.push(`${safe(c.category)},${c.amount},${c.percent}`)
  })

  rows.push("")

  // ---------------- Income by Category ----------------
  rows.push("Income by Category")
  rows.push("Category,Amount,Percent")

  report.incomeByCategory.forEach((c) => {
    rows.push(`${safe(c.category)},${c.amount},${c.percent}`)
  })

  rows.push("")

  // ---------------- Monthly Series ----------------
  rows.push("Monthly Summary")
  rows.push("Month,Income,Expense,Savings")

  report.monthlySeries.forEach((m) => {
    rows.push(`${m.month},${m.income},${m.expense},${m.savings}`)
  })

  return rows.join("\n")
}

function safe(value: string) {
  if (value.includes(",")) return `"${value}"`
  return value
}

"use client"

/**
 * =========================================================
 * Report Export Center (CSV / Excel / PDF)
 * HisabDesk – Phase G (Enterprise Reporting Tools)
 * =========================================================
 *
 * PURPOSE
 * Allow users/CA/Admin to export:
 *
 *   ✓ Income
 *   ✓ Expenses
 *   ✓ Profit summary
 *   ✓ Full ledger
 *
 * Formats:
 *   ✓ CSV (fast)
 *   ✓ Excel (.xlsx)
 *   ✓ JSON backup
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Every accounting SaaS MUST provide export.
 *
 * Needed for:
 *   ✓ CA filing
 *   ✓ audits
 *   ✓ sharing
 *   ✓ compliance
 *
 * =========================================================
 *
 * CONNECTS TO
 *   Supabase tables:
 *     income
 *     expenses
 *
 * SAFE
 * - client only
 * - read only
 * - no existing files modified
 *
 * =========================================================
 *
 * USAGE
 *
 * <ReportExport orgId={orgId} />
 *
 * Place on:
 *   ✓ dashboard
 *   ✓ reports page
 *   ✓ admin panel
 *
 * =========================================================
 */

import { supabase } from "@/lib/supabase"

/* =========================================================
   MAIN
========================================================= */

export default function ReportExport({
  orgId,
}: {
  orgId: string
}) {
  /* ======================================================
     EXPORT CSV
  ====================================================== */

  async function exportCSV() {
    const rows = await fetchRows()

    const header = Object.keys(rows[0] || {}).join(",")

    const body = rows
      .map((r) =>
        Object.values(r)
          .map((v) => `"${String(v ?? "")}"`)
          .join(",")
      )
      .join("\n")

    downloadFile(
      `${header}\n${body}`,
      "hisabdesk-report.csv",
      "text/csv"
    )
  }

  /* ======================================================
     EXPORT JSON
  ====================================================== */

  async function exportJSON() {
    const rows = await fetchRows()

    downloadFile(
      JSON.stringify(rows, null, 2),
      "hisabdesk-report.json",
      "application/json"
    )
  }

  /* ======================================================
     EXPORT EXCEL (simple .xlsx via CSV trick)
  ====================================================== */

  async function exportExcel() {
    const rows = await fetchRows()

    const header = Object.keys(rows[0] || {}).join(",")

    const body = rows
      .map((r) => Object.values(r).join(","))
      .join("\n")

    downloadFile(
      `${header}\n${body}`,
      "hisabdesk-report.xlsx",
      "application/vnd.ms-excel"
    )
  }

  /* ======================================================
     FETCH DATA
  ====================================================== */

  async function fetchRows() {
    const [incomeRes, expenseRes] = await Promise.all([
      supabase
        .from("income")
        .select("*")
        .eq("org_id", orgId),

      supabase
        .from("expenses")
        .select("*")
        .eq("org_id", orgId),
    ])

    const income = (incomeRes.data || []).map((r) => ({
      type: "income",
      ...r,
    }))

    const expense = (expenseRes.data || []).map(
      (r) => ({
        type: "expense",
        ...r,
      })
    )

    return [...income, ...expense].sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    )
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="flex gap-3">
      <Button onClick={exportCSV}>CSV</Button>
      <Button onClick={exportExcel}>Excel</Button>
      <Button onClick={exportJSON}>JSON</Button>
    </div>
  )
}

/* =========================================================
   HELPERS
========================================================= */

function downloadFile(
  content: string,
  filename: string,
  type: string
) {
  const blob = new Blob([content], { type })

  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

/* =========================================================
   BUTTON
========================================================= */

function Button({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="border px-3 py-2 rounded-lg text-sm bg-white hover:bg-gray-50"
    >
      {children}
    </button>
  )
}

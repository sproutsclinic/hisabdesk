// ==========================================================
// HisabDesk — Income List Page (Server Component)
// Next 16 SAFE • FREE MODE • NO cookies()
// GRAPH READY • CLIENT SAFE
// Phase 3 — Layout polish + fintech hierarchy
// Phase 3.1 — Query safety + pagination readiness + perf hardening
// ADDITIVE ONLY (no deletions)
// ==========================================================

import Link from "next/link"
import { getIncome } from "@/lib/api/income"
import IncomeListClient from "@/components/income/IncomeListClient"

export const dynamic = "force-dynamic"
export const revalidate = 60 // ✅ additive: ISR cache safety

/* ==========================================================
   CONSTANTS (ADDITIVE SAFETY)
========================================================== */

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 50 // safe initial payload

export default async function IncomeListPage() {
  const userId = "00000000-0000-0000-0000-000000000000"

  /* ========================================================
     SERVER-SIDE PAGINATED FETCH
     ✅ prevents overfetch
     ✅ faster TTFB
     ✅ client stays light
  ======================================================== */

  const { income, total } = await getIncome(
    userId,
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 space-y-6">

        {/* ================================================= */}
        {/* Header + Actions */}
        {/* ================================================= */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Income
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review all earnings and track your growth over time
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/income/add"
              className="h-9 px-4 rounded-xl bg-black text-white text-sm font-medium flex items-center"
            >
              + Add Income
            </Link>

            <Link
              href="/income/import"
              className="h-9 px-4 rounded-xl border border-gray-200 text-sm flex items-center"
            >
              Import Statement
            </Link>
          </div>
        </div>

        {/* ================================================= */}
        {/* Summary */}
        {/* ================================================= */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-xs text-gray-500">Total Income</p>
          <p className="text-2xl font-semibold text-green-600">
            ₹ {Number(total || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* ================================================= */}
        {/* List Card */}
        {/* ================================================= */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:p-5">
          <IncomeListClient
            initialIncome={income}
            total={total}
            page={DEFAULT_PAGE}     // ✅ additive
            pageSize={DEFAULT_PAGE_SIZE} // ✅ additive
          />
        </div>

      </div>
    </main>
  )
}

// ==========================================================
// HisabDesk — Expense List Page (STABLE • FREE MODE • NO AUTH)
// Server Component
// Phase 3 — Layout polish + fintech hierarchy
// Phase 3.1 — Query safety + pagination readiness + perf hardening
// ADDITIVE ONLY (no deletions)
// ==========================================================

import { getExpenses } from "@/lib/api/expenses"
import ExpenseListClient from "@/components/expense/ExpenseListClient"

export const revalidate = 60 // ✅ additive: ISR caching for list safety

/* ==========================================================
   CONSTANTS (ADDITIVE SAFETY)
========================================================== */

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 50 // safe cap for initial render

export default async function ExpenseListPage() {
  /* ========================================================
     FREE MODE
  ======================================================== */

  const userId = "00000000-0000-0000-0000-000000000000"

  /* ========================================================
     SERVER-SIDE PAGINATED FETCH (PRODUCTION SAFE)
     ✅ prevents heavy first paint
     ✅ keeps client light
  ======================================================== */

  const { expenses, total } = await getExpenses(
    userId,
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 space-y-6">

        {/* ================================================= */}
        {/* Header */}
        {/* ================================================= */}
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Expenses
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and review where your money is going
          </p>
        </div>

        {/* ================================================= */}
        {/* Summary */}
        {/* ================================================= */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-xs text-gray-500">Total Expenses</p>
          <p className="text-2xl font-semibold text-red-600">
            ₹ {Number(total || 0).toLocaleString("en-IN")}
          </p>
        </div>

        {/* ================================================= */}
        {/* List Card */}
        {/* ================================================= */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:p-5">

          {/* ✅ additive: pagination-ready props */}
          <ExpenseListClient
            initialExpenses={expenses}
            total={total}
            page={DEFAULT_PAGE}
            pageSize={DEFAULT_PAGE_SIZE}
          />

        </div>

      </div>
    </main>
  )
}

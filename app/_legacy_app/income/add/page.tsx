// ==========================================================
// HisabDesk — Income Add Page (Server Wrapper)
// renders client form only
// NO redirects
// Phase 3 — UX polish + fintech layout consistency
// ==========================================================

import AddIncomeForm from "@/components/income/AddIncomeForm"

export default function IncomeAddPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">

        {/* ================================================= */}
        {/* Header */}
        {/* ================================================= */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Add Income
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Record payments, invoices or receipts to keep your finances updated
          </p>
        </div>

        {/* ================================================= */}
        {/* Form Card */}
        {/* ================================================= */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
          <AddIncomeForm />
        </div>

      </div>
    </main>
  )
}

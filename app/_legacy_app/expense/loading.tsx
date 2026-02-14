// ==========================================================
// HisabDesk — Expense List Loading Skeleton
// Phase 3 — Production polish
// Server-safe • zero logic • prevents blank screen
// ADDITIVE ONLY
// ==========================================================

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 space-y-6 animate-pulse">

        {/* ================================================= */}
        {/* Header */}
        {/* ================================================= */}
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-72 bg-gray-200 rounded" />
        </div>

        {/* ================================================= */}
        {/* Summary card */}
        {/* ================================================= */}
        <div className="rounded-2xl border bg-gray-50 p-5">
          <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-40 bg-gray-200 rounded" />
        </div>

        {/* ================================================= */}
        {/* KPI small cards */}
        {/* ================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-gray-200"
            />
          ))}
        </div>

        {/* ================================================= */}
        {/* Charts placeholders */}
        {/* ================================================= */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-gray-200" />
          <div className="h-64 rounded-2xl bg-gray-200" />
        </div>

        {/* ================================================= */}
        {/* List rows */}
        {/* ================================================= */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-gray-200"
            />
          ))}
        </div>

      </div>
    </div>
  )
}

// ==========================================================
// HisabDesk — Dashboard Loading (PRODUCTION SKELETON)
// Phase 3 — UX polish + mobile responsiveness + stability
// ADDITIVE ONLY (no deletions)
// ==========================================================

export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen animate-pulse">

      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}
      <div className="space-y-2">
        <div className="h-7 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>

      {/* ====================================================== */}
      {/* KPI GRID — responsive like production dashboard */}
      {/* mobile: 2  tablet: 3  desktop: 6 */}
      {/* ====================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-2xl"
          />
        ))}
      </div>

      {/* ====================================================== */}
      {/* Forecast Cards */}
      {/* ====================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={`forecast-${i}`}
            className="h-20 bg-gray-200 rounded-2xl"
          />
        ))}
      </div>

      {/* ====================================================== */}
      {/* Chart placeholder */}
      {/* ====================================================== */}
      <div className="h-72 bg-gray-200 rounded-2xl" />

      {/* ====================================================== */}
      {/* Buttons row */}
      {/* ====================================================== */}
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={`btn-${i}`}
            className="h-10 w-28 bg-gray-200 rounded-xl"
          />
        ))}
      </div>

      {/* ====================================================== */}
      {/* AI / Insights section placeholder */}
      {/* ====================================================== */}
      <div className="h-24 bg-gray-200 rounded-2xl" />

    </div>
  )
}

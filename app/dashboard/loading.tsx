export default function Loading() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen animate-pulse">

      {/* Title */}
      <div className="h-7 w-40 bg-gray-200 rounded" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-2xl"
          />
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="h-72 bg-gray-200 rounded-2xl" />

      {/* Buttons row */}
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-28 bg-gray-200 rounded-xl"
          />
        ))}
      </div>

      {/* AI section placeholder */}
      <div className="h-24 bg-gray-200 rounded-2xl" />

    </div>
  )
}

"use client"

/* =========================================================
   Expense Monthly Chart (UI only)
   ---------------------------------------------------------
   ✓ lightweight
   ✓ no chart libs
   ✓ zero deps
   ✓ mobile safe
   ✓ fast
   ✓ consistent with Income chart
========================================================= */

type Point = {
  month: string
  amount: number
}

export default function ExpenseMonthlyChart({
  data,
}: {
  data: Point[]
}) {
  if (!data?.length) return null

  const max = Math.max(...data.map((d) => d.amount), 1)

  return (
    <div className="p-4 border rounded-xl bg-white space-y-4">

      <h3 className="text-sm font-medium">Monthly Trend</h3>

      <div className="flex items-end gap-3 h-36">

        {data.map((d) => {
          const height = (d.amount / max) * 100

          return (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-full bg-red-500 rounded-md transition-all"
                style={{ height: `${height}%` }}
              />

              <span className="text-[10px] text-muted-foreground">
                {d.month.slice(5)}
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}

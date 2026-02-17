ï»¿"use client"

import { Card } from "@/components/ui/card"
import { useBills } from "@/hooks/useBills"

export default function BillsPage() {
  const { overview, loading, error, create, remove } =
    useBills()

  const rows = overview?.bills ?? []

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Bills</h1>

      {overview && (
        <div className="grid md:grid-cols-4 gap-4">
          <Stat label="Monthly Total" value={overview.summary.totalMonthly} />
          <Stat label="Due This Month" value={overview.summary.upcomingThisMonth} />
          <Stat label="AutoPay" value={overview.summary.autoPayCount} prefix="" />
          <Stat label="Active Bills" value={overview.summary.activeBills} prefix="" />
        </div>
      )}

      <Card className="p-6 space-y-3">
        {rows.map((b) => (
          <div
            key={b.id}
            className="flex justify-between border rounded p-3 text-sm"
          >
            <div>
              <div className="font-medium">{b.name}</div>
              <div className="text-muted-foreground">
                Due in {b.daysLeft} days
              </div>
            </div>

            <div className="flex gap-4">
              ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {Math.round(b.amount)}
              <button onClick={() => remove(b.id)}>Delete</button>
            </div>
          </div>
        ))}
      </Card>

      {loading && <div>LoadingÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}

/* ========================================================= */

function Stat({
  label,
  value,
  prefix = "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ ",
}: {
  label: string
  value: number
  prefix?: string
}) {
  return (
    <Card className="p-4">
      <div className="text-xs text-muted-foreground">
        {label}
      </div>
      <div className="text-lg font-semibold">
        {prefix}
        {Math.round(value)}
      </div>
    </Card>
  )
}

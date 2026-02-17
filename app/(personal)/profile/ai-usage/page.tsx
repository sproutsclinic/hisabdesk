ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Usage Page (Profile ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ AI Usage)
// ----------------------------------------------------------
// PURPOSE
//   User-facing AI usage dashboard
//
//   Uses:
//     GET /api/ai/usage-report
//
//   Shows:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ total tokens
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ total cost
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ remaining budget
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ projected monthly cost
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ module breakdown table
//
// RULES
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ does NOT call OpenAI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ only reads report API
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ clean + minimal UI
// ==========================================================

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

// ==========================================================
// TYPES
// ==========================================================

interface ModuleRow {
  module: string
  tokens: number
  cost: number
  percent: number
}

interface Report {
  summary: {
    totalTokens: number
    totalCost: number
    remainingBudget: number
    projectedMonthlyCost: number
    status: "healthy" | "warning" | "limit"
  }
  modules: ModuleRow[]
}

// ==========================================================
// PAGE
// ==========================================================

export default function AIUsagePage() {
  const [data, setData] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  // ========================================================
  // FETCH
  // ========================================================

  useEffect(() => {
    fetch("/api/ai/usage-report")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [])

  // ========================================================
  // UI HELPERS
  // ========================================================

  function statusColor(status: string) {
    if (status === "healthy") return "text-green-600"
    if (status === "warning") return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return <div className="p-6">Loading AI usageÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦</div>
  }

  if (!data) {
    return <div className="p-6">No usage data available.</div>
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="p-6 space-y-6">
      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}

      <div>
        <h1 className="text-2xl font-semibold">
          AI Usage & Cost
        </h1>
        <p className="text-sm text-muted-foreground">
          Monthly AI consumption and budget tracking
        </p>
      </div>

      {/* -------------------------------------------------- */}
      {/* SUMMARY CARDS */}
      {/* -------------------------------------------------- */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Total Cost
          </p>
          <p className="text-xl font-semibold">
            ${data.summary.totalCost}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Remaining Budget
          </p>
          <p className="text-xl font-semibold">
            ${data.summary.remainingBudget}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Projected Month Cost
          </p>
          <p className="text-xl font-semibold">
            ${data.summary.projectedMonthlyCost}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Status
          </p>
          <p
            className={`text-xl font-semibold ${statusColor(
              data.summary.status
            )}`}
          >
            {data.summary.status.toUpperCase()}
          </p>
        </Card>
      </div>

      {/* -------------------------------------------------- */}
      {/* MODULE BREAKDOWN */}
      {/* -------------------------------------------------- */}

      <Card className="p-4">
        <h2 className="font-semibold mb-4">
          Module Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground border-b">
              <tr className="text-left">
                <th className="py-2">Module</th>
                <th>Tokens</th>
                <th>Cost ($)</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>
              {data.modules.map((m) => (
                <tr
                  key={m.module}
                  className="border-b last:border-0"
                >
                  <td className="py-2 font-medium">
                    {m.module}
                  </td>
                  <td>{m.tokens}</td>
                  <td>{m.cost}</td>
                  <td>{m.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

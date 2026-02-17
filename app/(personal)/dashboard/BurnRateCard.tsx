ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Burn Rate Card
// ----------------------------------------------------------
// PURPOSE
//   Shows monthly burn health
//
//   Displays:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ monthly income
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ monthly expense
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ burn rate %
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ runway months
//
//   Why:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ survival metric
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ detects overspending early
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ feeds AI + alerts
//
//   Uses:
//     GET /api/dashboard/burn-rate
//
//   RULE:
//     NO AI here (pure math only)
//
//   Usage:
//     <BurnRateCard />
//
// ==========================================================

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

// ==========================================================
// TYPES
// ==========================================================

interface BurnResponse {
  monthlyIncome: number
  monthlyExpense: number
  burnRate: number
  runwayMonths: number
}

// ==========================================================
// HELPERS
// ==========================================================

function burnColor(rate: number) {
  if (rate > 85) return "text-red-600"
  if (rate > 65) return "text-yellow-600"
  return "text-green-600"
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function BurnRateCard() {
  const [data, setData] = useState<BurnResponse>({
    monthlyIncome: 0,
    monthlyExpense: 0,
    burnRate: 0,
    runwayMonths: 0,
  })

  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // LOAD
  // --------------------------------------------------------

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const res = await fetch("/api/dashboard/burn-rate")
        const json = await res.json()

        setData(json)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // ========================================================
  // UI
  // ========================================================

  return (
    <Card className="p-5 space-y-3">
      <p className="text-sm font-medium">Burn Rate</p>

      {loading ? (
        <p className="text-xs text-muted-foreground">
          CalculatingÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦
        </p>
      ) : (
        <div className="space-y-2 text-sm">

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Income (month)
            </span>
            <span className="text-green-600 font-medium">
              ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {data.monthlyIncome.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Expense (month)
            </span>
            <span className="text-red-600 font-medium">
              ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {data.monthlyExpense.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Burn Rate</span>
            <span className={burnColor(data.burnRate)}>
              {data.burnRate}%
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Runway
            </span>
            <span>
              {data.runwayMonths} months
            </span>
          </div>

        </div>
      )}
    </Card>
  )
}

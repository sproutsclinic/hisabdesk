ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Categories Card (Top Spending)
// ----------------------------------------------------------
// PURPOSE
//   Shows expense breakdown by category
//
//   Why:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ fast
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ no chart libraries
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ simple grid (matches your current dashboard style)
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ feeds user awareness instantly
//
//   Uses:
//     GET /api/dashboard/categories
//
//   NOTE:
//     This replaces heavy pie charts with lightweight UI
//     (performance-first design)
//
//   Usage:
//     <CategoriesCard />
//
// ==========================================================

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

// ==========================================================
// TYPES
// ==========================================================

interface CategoryRow {
  category: string
  amount: number
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function CategoriesCard() {
  const [rows, setRows] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // LOAD
  // --------------------------------------------------------

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const res = await fetch("/api/dashboard/categories")
        const json = await res.json()

        setRows(json || [])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // show top 6 only
  const top = rows.slice(0, 6)

  // ========================================================
  // UI
  // ========================================================

  return (
    <Card className="p-5 space-y-3">
      <p className="text-sm font-medium">Top Spending</p>

      {loading ? (
        <p className="text-xs text-muted-foreground">
          Loading categoriesÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦
        </p>
      ) : top.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No expenses yet
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {top.map((r) => (
            <div
              key={r.category}
              className="bg-red-50 rounded-lg p-3 text-center"
            >
              <p className="text-xs text-gray-500">
                {r.category}
              </p>

              <p className="font-semibold text-red-600">
                ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {r.amount.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

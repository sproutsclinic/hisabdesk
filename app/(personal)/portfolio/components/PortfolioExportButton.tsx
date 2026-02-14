/* =========================================================
   HisabDesk — PortfolioExportButton
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Trigger CSV export
   - Calls server route
   - No calculations
   - No DB
   - No AI

   ARCHITECTURE
     UI → /api/portfolio/export → report.ts → CSV

   RULES
   ✅ client fetch only
   ❌ no business logic
   ❌ no supabase
   ❌ no AI

   ========================================================= */

"use client"

import { useState } from "react"

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioExportButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    try {
      setLoading(true)

      const res = await fetch(
        "/api/portfolio/export?type=csv",
      )

      if (!res.ok) throw new Error("Export failed")

      const blob = await res.blob()

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "portfolio.csv"
      document.body.appendChild(a)
      a.click()

      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="text-xs px-3 py-1 rounded border"
    >
      {loading ? "Exporting..." : "Export CSV"}
    </button>
  )
}

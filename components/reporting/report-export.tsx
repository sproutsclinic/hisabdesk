ï»¿"use client"

/**
 * =========================================================
 * Report Export (Personal Mode ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â API Driven)
 * ---------------------------------------------------------
 * UI Trigger Only.
 * Server performs:
 *   auth ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ query ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ validation ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ formatting ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ file stream
 * =========================================================
 */

import { useState } from "react"

export default function ReportExport() {
  const [loading, setLoading] = useState<string | null>(null)

  async function download(endpoint: string, filename: string) {
    try {
      setLoading(filename)

      const res = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Export failed")

      const blob = await res.blob()

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()

      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error("Export error:", e)
      alert("Failed to export file")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-3">
      <Button onClick={() => download("/api/reports/export?format=csv", "hisabdesk.csv")} loading={loading === "hisabdesk.csv"}>
        CSV
      </Button>

      <Button onClick={() => download("/api/reports/export?format=xlsx", "hisabdesk.xlsx")} loading={loading === "hisabdesk.xlsx"}>
        Excel
      </Button>

      <Button onClick={() => download("/api/reports/export?format=json", "hisabdesk.json")} loading={loading === "hisabdesk.json"}>
        JSON
      </Button>
    </div>
  )
}

/* ========================================================= */

function Button({
  children,
  onClick,
  loading,
}: {
  children: React.ReactNode
  onClick: () => void
  loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="border px-3 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "PreparingÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦" : children}
    </button>
  )
}

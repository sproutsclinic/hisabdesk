ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â TaxPDFButton
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Download latest tax report as PDF
   - Calls server export API
   - ZERO business logic
   - ZERO calculations
   - ZERO DB
   - ZERO AI

   Architecture:
     Button ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ /api/tax/export?type=pdf ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ pdf.ts ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ file

   Safe:
   - Stateless
   - Reusable
   - Server authoritative

   ========================================================= */

"use client"

import { useState } from "react"

interface Props {
  financialYear?: string
  className?: string
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function TaxPDFButton({
  financialYear = "2024-25",
  className = "",
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* =======================================================
     DOWNLOAD PDF
     ======================================================= */

  const downloadPDF = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `/api/tax/export?fy=${financialYear}&type=pdf`,
      )

      if (!res.ok) throw new Error("PDF export failed")

      const blob = await res.blob()

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `tax-${financialYear}.pdf`

      document.body.appendChild(a)
      a.click()

      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || "PDF export failed")
    } finally {
      setLoading(false)
    }
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="space-y-2">
      <button
        onClick={downloadPDF}
        disabled={loading}
        className={`px-4 py-2 rounded border text-sm hover:bg-muted disabled:opacity-50 ${className}`}
      >
        {loading ? "Preparing PDF..." : "Export PDF"}
      </button>

      {error && (
        <div className="text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}

ï»¿// ==========================================================
// Reports Client (Fetch Wrapper)
// Layer: Client ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ API only
//
// Responsibilities:
// - typed fetch helpers
// - calls /api/reports endpoints
// - NO business logic
// - NO calculations
// - NO Supabase
//
// Used by:
// hooks/useReports
// ==========================================================

import type {
  ReportsResult,
  ReportsQuery,
} from "./reports.types"

/* =========================================================
Helpers
========================================================= */

function buildQuery(params?: ReportsQuery) {
  const search = new URLSearchParams()

  if (!params) return ""

  if (params.range) search.append("range", params.range)
  if (params.from) search.append("from", params.from)
  if (params.to) search.append("to", params.to)

  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

async function safeJSON<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Request failed")
  }

  return res.json()
}

/* =========================================================
Public API
========================================================= */

export const reportsClient = {
  /* -------------------------------------------------------
  Fetch reports JSON
  ------------------------------------------------------- */
  async getReports(query?: ReportsQuery): Promise<ReportsResult> {
    const res = await fetch(`/api/reports${buildQuery(query)}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    return safeJSON<ReportsResult>(res)
  },

  /* -------------------------------------------------------
  Download CSV
  ------------------------------------------------------- */
  async exportCSV(query?: ReportsQuery): Promise<Blob> {
    const qs = buildQuery(query)
    const url = `/api/reports/export${qs ? `${qs}&format=csv` : "?format=csv"}`

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || "Export failed")
    }

    return res.blob()
  },
}

ï»¿"use client"

/**
 * =========================================================
 * Advanced Filters Bar (Enterprise Reporting Controls)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase G (Pro Analytics UX)
 * =========================================================
 *
 * PURPOSE
 * Let users filter reports like professional tools:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ date range
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ income/expense type
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ amount range
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ search text
 *
 * WHY IMPORTANT
 * ---------------------------------------------------------
 * Real accountants NEED filters.
 *
 * Without:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ scroll manually
 *
 * With:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ instant insights
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ CA-friendly
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ professional SaaS feel
 *
 * Similar to:
 *   QuickBooks filters
 *   Zoho Books
 *   Tally reports
 *
 * =========================================================
 *
 * USAGE
 *
 * const [filters, setFilters] = useState({})
 *
 * <AdvancedFilters
 *    value={filters}
 *    onChange={setFilters}
 * />
 *
 * Then pass filters to your query.
 *
 * =========================================================
 *
 * SAFE
 * - UI only
 * - no DB logic
 * - reusable everywhere
 * =========================================================
 */

import { useState } from "react"

/* =========================================================
   TYPES
========================================================= */

export type ReportFilters = {
  from?: string
  to?: string
  type?: "all" | "income" | "expense"
  min?: number
  max?: number
  search?: string
}

type Props = {
  value: ReportFilters
  onChange: (v: ReportFilters) => void
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AdvancedFilters({
  value,
  onChange,
}: Props) {
  const [local, setLocal] = useState(value)

  function update(key: keyof ReportFilters, v: any) {
    const next = { ...local, [key]: v }
    setLocal(next)
    onChange(next)
  }

  function reset() {
    const empty: ReportFilters = {
      type: "all",
    }
    setLocal(empty)
    onChange(empty)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="border rounded-2xl p-4 bg-white flex flex-wrap gap-3 items-end">
      {/* DATE FROM */}
      <Field label="From">
        <input
          type="date"
          value={local.from || ""}
          onChange={(e) =>
            update("from", e.target.value)
          }
          className="input"
        />
      </Field>

      {/* DATE TO */}
      <Field label="To">
        <input
          type="date"
          value={local.to || ""}
          onChange={(e) =>
            update("to", e.target.value)
          }
          className="input"
        />
      </Field>

      {/* TYPE */}
      <Field label="Type">
        <select
          value={local.type || "all"}
          onChange={(e) =>
            update("type", e.target.value)
          }
          className="input"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </Field>

      {/* MIN */}
      <Field label="Min ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹">
        <input
          type="number"
          value={local.min ?? ""}
          onChange={(e) =>
            update("min", Number(e.target.value))
          }
          className="input"
        />
      </Field>

      {/* MAX */}
      <Field label="Max ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹">
        <input
          type="number"
          value={local.max ?? ""}
          onChange={(e) =>
            update("max", Number(e.target.value))
          }
          className="input"
        />
      </Field>

      {/* SEARCH */}
      <Field label="Search">
        <input
          placeholder="notes / client..."
          value={local.search || ""}
          onChange={(e) =>
            update("search", e.target.value)
          }
          className="input w-40"
        />
      </Field>

      {/* RESET */}
      <button
        onClick={reset}
        className="text-xs underline opacity-70"
      >
        Reset
      </button>
    </div>
  )
}

/* =========================================================
   FIELD WRAPPER
========================================================= */

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col text-xs gap-1">
      <span className="opacity-60">{label}</span>
      {children}
    </div>
  )
}

ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â VaultCategoryFilter
   ---------------------------------------------------------
   UI ONLY
   Category dropdown filter
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no business logic
   ========================================================= */

"use client"

import type { VaultCategory } from "@/lib/api/vault/types"

/* ========================================================= */

interface Props {
  onChange: (category: VaultCategory | "all") => void
}

/* ========================================================= */

const CATEGORIES: (VaultCategory | "all")[] = [
  "all",
  "identity",
  "tax",
  "bank",
  "insurance",
  "investment",
  "loan",
  "other",
]

/* ========================================================= */

export default function VaultCategoryFilter({
  onChange,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        Filter:
      </span>

      <select
        className="border rounded p-2 text-sm"
        onChange={(e) =>
          onChange(e.target.value as any)
        }
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )
}

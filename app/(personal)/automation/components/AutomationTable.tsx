/* =========================================================
   HisabDesk — AutomationTable
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Display recurring rules list
   - Delete action only
   - ZERO business logic
   - ZERO calculations
   - ZERO fetch

   ARCHITECTURE
     page → useAutomation → rows → AutomationTable

   RULES
   ✅ presentation only
   ❌ no API
   ❌ no math
   ❌ no DB
   ❌ no AI

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

import type { AutomationRuleRow } from "@/lib/api/automation/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  rows: AutomationRuleRow[]
  onDelete: (id: string) => void
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function AutomationTable({
  rows,
  onDelete,
}: Props) {
  return (
    <Card className="p-6 space-y-3">
      <h2 className="font-medium">Recurring Rules</h2>

      {/* --------------------------------------------------- */}
      {/* EMPTY */}
      {/* --------------------------------------------------- */}

      {rows.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No automation rules yet
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* TABLE */}
      {/* --------------------------------------------------- */}

      {rows.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between border rounded p-3 text-sm"
        >
          {/* left */}
          <div className="flex flex-col">
            <span className="font-medium">{r.name}</span>
            <span className="text-muted-foreground">
              {r.type} • {r.category}
            </span>
          </div>

          {/* middle */}
          <div className="flex gap-6">
            <span>
              ₹ {Math.round(r.amount)}
            </span>

            <span className="text-muted-foreground">
              {r.frequency}
            </span>

            <span className="text-muted-foreground">
              starts {r.start_date}
            </span>
          </div>

          {/* delete */}
          <button
            onClick={() => onDelete(r.id)}
            className="text-xs border px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </Card>
  )
}

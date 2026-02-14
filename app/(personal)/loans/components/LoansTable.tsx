/* =========================================================
   HisabDesk — LoansTable
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Display list of loans
   - Render computed values from API
   - Delete action only
   - ZERO business logic
   - ZERO calculations

   ARCHITECTURE
     page → LoansTable → hook(remove)

   RULES
   ✅ presentation only
   ❌ no math
   ❌ no fetch
   ❌ no DB
   ❌ no AI

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

import type { LoanComputed } from "@/lib/api/loans/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  rows: LoanComputed[]
  onDelete: (id: string) => Promise<void>
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LoansTable({
  rows,
  onDelete,
}: Props) {
  return (
    <Card className="p-6 space-y-3">
      <h2 className="font-medium">Your Loans</h2>

      {rows.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No loans added yet
        </div>
      )}

      {rows.map((loan) => (
        <div
          key={loan.id}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded p-3 text-sm"
        >
          {/* -------------------------------------------------
             LEFT
             ------------------------------------------------- */}
          <div className="flex flex-col">
            <span className="font-medium">{loan.name}</span>
            <span className="text-muted-foreground">
              {loan.type}
            </span>
          </div>

          {/* -------------------------------------------------
             STATS
             ------------------------------------------------- */}
          <div className="grid grid-cols-2 md:flex gap-4 md:gap-6 text-xs md:text-sm">
            <span>
              EMI ₹ {Math.round(loan.emi)}
            </span>

            <span>
              Outstanding ₹{" "}
              {Math.round(loan.outstandingPrincipal)}
            </span>

            <span>
              Interest ₹{" "}
              {Math.round(loan.totalInterest)}
            </span>

            <span>
              {loan.remainingMonths} months left
            </span>
          </div>

          {/* -------------------------------------------------
             ACTIONS
             ------------------------------------------------- */}
          <button
            onClick={() => onDelete(loan.id)}
            className="text-xs border px-2 py-1 rounded hover:bg-muted"
          >
            Delete
          </button>
        </div>
      ))}
    </Card>
  )
}

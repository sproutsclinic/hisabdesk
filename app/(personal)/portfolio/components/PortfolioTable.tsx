/* =========================================================
   HisabDesk — PortfolioTable
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Display holdings table
   - Pure presentational
   - No business logic
   - No DB
   - No calculations
   - Receives computed values from server/engine

   ARCHITECTURE
     page → usePortfolio → API → engine → computed rows
                                           ↓
                                       this table

   RULES
   ✅ UI only
   ❌ no math
   ❌ no hooks calling APIs
   ❌ no supabase
   ❌ no AI

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"
import type { PortfolioAssetComputed } from "@/lib/api/portfolio/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  rows: PortfolioAssetComputed[]
  onDelete?: (id: string) => void
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioTable({
  rows,
  onDelete,
}: Props) {
  if (!rows?.length) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        No assets added yet
      </Card>
    )
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* ------------------------------------------------
             HEADER
             ------------------------------------------------ */}
          <thead className="border-b bg-muted/40">
            <tr className="text-left">
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Qty</Th>
              <Th>Invested</Th>
              <Th>Current</Th>
              <Th>P/L</Th>
              <Th>Return %</Th>
              <Th>Allocation %</Th>
              <Th />
            </tr>
          </thead>

          {/* ------------------------------------------------
             BODY
             ------------------------------------------------ */}
          <tbody>
            {rows.map((a) => (
              <tr
                key={a.id}
                className="border-b hover:bg-muted/30"
              >
                <Td className="font-medium">{a.name}</Td>
                <Td>{a.type}</Td>
                <Td>{a.quantity}</Td>

                <Td>₹ {Math.round(a.investedValue)}</Td>
                <Td>₹ {Math.round(a.currentValue)}</Td>

                <Td
                  className={
                    a.profitLoss >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  ₹ {Math.round(a.profitLoss)}
                </Td>

                <Td>{a.returnPercent}%</Td>
                <Td>{a.allocationPercent}%</Td>

                <Td>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(a.id)}
                      className="text-xs border px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* =========================================================
   SMALL UI HELPERS
   ========================================================= */

function Th({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <th className="px-4 py-3 font-medium text-muted-foreground">
      {children}
    </th>
  )
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <td className={`px-4 py-3 ${className}`}>
      {children}
    </td>
  )
}

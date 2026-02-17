ï»¿"use client"

/**
 * =========================================================
 * AI Suggestions (Presentation Layer Only)
 * ---------------------------------------------------------
 * Receives already-prepared financial data.
 * MUST NOT import DB types.
 * MUST NOT know Supabase schema.
 * =========================================================
 */

import React from "react"

/* =========================================================
   SAFE INPUT TYPES (AI-facing, not DB-facing)
   ========================================================= */

export interface IncomeInput {
  amount: number
  category: string
  date: string
}

export interface ExpenseInput {
  amount: number
  category: string
  date: string
}

interface Props {
  income?: IncomeInput[]
  expenses?: ExpenseInput[]
}

export default function AISuggestions({ income = [], expenses = [] }: Props) {
  if (!income.length && !expenses.length) {
    return null
  }

  return (
    <div className="rounded-xl border p-4 space-y-2">
      <h3 className="font-semibold text-sm">AI Insights</h3>
      <p className="text-sm text-muted-foreground">
        Insights will be generated based on your financial patterns.
      </p>
    </div>
  )
}

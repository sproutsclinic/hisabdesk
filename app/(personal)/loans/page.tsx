ï»¿"use client"

import { useLoans } from "@/hooks/useLoans"

import LoansSummaryCards from "./components/LoansSummaryCards"
import LoansForm from "./components/LoansForm"
import LoansTable from "./components/LoansTable"
import LoansEmptyState from "./components/LoansEmptyState"
import LoansAIAdviceCard from "./components/LoansAIAdviceCard"

/* ========================================================= */

export default function LoansPage() {
  const {
    overview,
    loading,
    error,
    create,
    remove,
  } = useLoans()

  const rows = overview?.loans ?? []

  return (
    <div className="space-y-6 p-6">

      <div>
        <h1 className="text-2xl font-semibold">Loans</h1>
        <p className="text-sm text-muted-foreground">
          Track EMIs, outstanding balance and payoff progress
        </p>
      </div>

      {overview && (
        <LoansSummaryCards summary={overview.summary} />
      )}

      <LoansForm loading={loading} onSubmit={create} />

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {rows.length === 0 && <LoansEmptyState />}

      {rows.length > 0 && (
        <LoansTable rows={rows} onDelete={remove} />
      )}

      {rows.length > 0 && <LoansAIAdviceCard />}
    </div>
  )
}

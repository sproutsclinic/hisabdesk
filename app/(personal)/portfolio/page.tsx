"use client"

import { useMemo } from "react"

/* ✅ ONLY REAL HOOKS */
import { usePortfolioAI } from "@/hooks/usePortfolio"
import { usePortfolioFilters } from "@/hooks/usePortfolioFilters"

import PortfolioSummaryCards from "./components/PortfolioSummaryCards"
import PortfolioForm from "./components/PortfolioForm"
import PortfolioTable from "./components/PortfolioTable"
import PortfolioAllocationChart from "./components/PortfolioAllocationChart"
import PortfolioAIAdviceCard from "./components/PortfolioAIAdviceCard"
import PortfolioToolbar from "./components/PortfolioToolbar"
import PortfolioEmptyState from "./components/PortfolioEmptyState"
import PortfolioSIPAdviceCard from "./components/PortfolioSIPAdviceCard"
import PortfolioXIRRCard from "./components/PortfolioXIRRCard"

/* ========================================================= */

export default function PortfolioPage() {

  /* =======================================================
     TEMP STATIC STATE (until real usePortfolio hook added)
  ======================================================= */

  const assets: any[] = []
  const overview = null
  const loading = false
  const error = null

  const create = async () => {}
  const remove = async () => {}

  /* =======================================================
     FILTERING
  ======================================================= */

  const {
    rows: filteredRows,
    setFilters,
  } = usePortfolioFilters(assets as any)

  const types = useMemo(() => {
    const set = new Set<string>()
    assets?.forEach((a: any) => set.add(a.type))
    return Array.from(set)
  }, [assets])

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6 p-6">

      <div>
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Track assets, allocation and returns
        </p>
      </div>

      {overview && (
        <PortfolioSummaryCards summary={overview.summary} />
      )}

      {assets.length > 0 && (
        <PortfolioAllocationChart rows={assets} />
      )}

      <PortfolioSIPAdviceCard />
      <PortfolioXIRRCard />

      <PortfolioForm loading={loading} onSubmit={create} />

      {assets.length > 0 && (
        <PortfolioToolbar
          types={types}
          onFilterChange={setFilters}
        />
      )}

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {assets.length === 0 && <PortfolioEmptyState />}

      {filteredRows?.length > 0 && (
        <PortfolioTable
          rows={filteredRows}
          onDelete={remove}
        />
      )}

      {assets.length > 0 && <PortfolioAIAdviceCard />}

    </div>
  )
}
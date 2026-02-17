ï»¿"use client"

import { useMemo } from "react"

import type {
  PortfolioAssetComputed,
  PortfolioOverview,
} from "@/lib/api/portfolio/types"

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

/* =========================================================
   TEMP PLACEHOLDER DATA (until backend hook is wired)
   Must MATCH PortfolioOverview exactly
   ========================================================= */

const EMPTY_OVERVIEW: PortfolioOverview = {
  assets: [],
  summary: {
    totalInvested: 0,
    totalCurrent: 0,
    totalPnL: 0,
    totalReturnPercent: 0,
  },
}

export default function PortfolioPage() {
  /* -------------------------------------------------------
     Using placeholder domain object (strict-mode safe)
     ------------------------------------------------------- */

  const overview: PortfolioOverview = EMPTY_OVERVIEW

  const assets: PortfolioAssetComputed[] = overview.assets

  const loading = false
  const error: string | null = null

  const create = async (_data: unknown) => {}
  const remove = async (_id: string) => {}

  /* -------------------------------------------------------
     FILTERING (UI only)
     ------------------------------------------------------- */

  const { rows: filteredRows, setFilters } =
    usePortfolioFilters(assets)

  const types = useMemo(() => {
  const set = new Set<PortfolioAssetComputed["type"]>()

  assets.forEach((a) => set.add(a.type))

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

      {/* Summary */}
      <PortfolioSummaryCards summary={overview.summary} />

      {/* Allocation Chart */}
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

      {filteredRows.length > 0 && (
        <PortfolioTable rows={filteredRows} onDelete={remove} />
      )}

      {assets.length > 0 && <PortfolioAIAdviceCard />}
    </div>
  )
}

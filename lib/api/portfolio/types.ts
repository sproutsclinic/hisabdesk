/* =========================================================
   HisabDesk — Portfolio Types
   ---------------------------------------------------------
   DOMAIN LAYER (types only)

   PURPOSE
   - Single source of truth for Portfolio module contracts
   - Shared by:
       ✓ API routes
       ✓ services
       ✓ hooks
       ✓ UI
       ✓ AI advisor

   RULES
   ✅ types only
   ❌ no logic
   ❌ no DB
   ❌ no side effects

   ARCHITECTURE
     lib/api/portfolio/*
        types.ts  ← YOU ARE HERE
        service.ts
        engine.ts
        report.ts
        validators.ts

   ========================================================= */

/* =========================================================
   CORE ENUMS
   ========================================================= */

export type AssetType =
  | "stock"
  | "mutual_fund"
  | "etf"
  | "crypto"
  | "gold"
  | "real_estate"
  | "fd"
  | "bond"
  | "cash"
  | "other"



/* =========================================================
   DB ROW
   ---------------------------------------------------------
   Mirrors `assets` table
   (single source of truth for holdings)
   ========================================================= */

export interface AssetRow {
  id: string
  user_id: string

  name: string
  type: AssetType

  quantity: number
  buy_price: number
  current_price: number

  created_at: string
  updated_at: string
}



/* =========================================================
   CRUD REQUESTS
   ========================================================= */

export interface CreateAssetRequest {
  name: string
  type: AssetType
  quantity: number
  buy_price: number
  current_price: number
}

export interface UpdateAssetRequest
  extends Partial<CreateAssetRequest> {
  id: string
}



/* =========================================================
   COMPUTED METRICS
   ---------------------------------------------------------
   Returned by engine/service
   NOT stored directly
   ========================================================= */

export interface PortfolioAssetComputed extends AssetRow {
  investedValue: number
  currentValue: number
  profitLoss: number
  returnPercent: number
  allocationPercent: number
}



/* =========================================================
   SUMMARY
   ========================================================= */

export interface PortfolioSummary {
  totalInvested: number
  totalCurrent: number
  totalPnL: number
  totalReturnPercent: number
}



/* =========================================================
   FULL RESPONSE (dashboard/overview)
   ========================================================= */

export interface PortfolioOverview {
  assets: PortfolioAssetComputed[]
  summary: PortfolioSummary
}



/* =========================================================
   AI REBALANCE TYPES (future advisor)
   ========================================================= */

export interface RebalanceSuggestion {
  assetId: string
  action: "buy" | "sell" | "hold"
  amount: number
  reason: string
}

export interface PortfolioRebalanceResult {
  suggestions: RebalanceSuggestion[]
  notes: string
}

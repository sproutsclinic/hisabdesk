"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import EmptyState from "@/components/ui/emptyState"

import {
  Landmark,
  Home,
  Banknote,
  TrendingUp,
  TrendingDown
} from "lucide-react"

/* =================================================
   NET WORTH DASHBOARD — Financial Intelligence Layer

   Purpose:
   ✅ shows total assets
   ✅ shows liabilities
   ✅ shows net worth
   ✅ pulls automatically from vault_items.metadata
   ✅ instant clarity for users
   ✅ huge perceived value

   Categories used:
   property  → current_value
   tax       → amount
   loans     → outstanding

================================================= */

type VaultItem = {
  id: string
  category: string
  metadata: any
}

export default function NetWorthPage() {
  const [loading, setLoading] = useState(true)

  const [assets, setAssets] = useState(0)
  const [liabilities, setLiabilities] = useState(0)

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)

    const { data } = await supabase
      .from("vault_items")
      .select("category, metadata")

    const rows: VaultItem[] = data || []

    let assetTotal = 0
    let liabilityTotal = 0

    rows.forEach((item) => {
      const m = item.metadata || {}

      /* assets */
      if (item.category === "property") {
        assetTotal += Number(m.current_value || 0)
      }

      if (item.category === "tax") {
        assetTotal += Number(m.amount || 0)
      }

      /* liabilities */
      if (item.category === "loans") {
        liabilityTotal += Number(m.outstanding || 0)
      }
    })

    setAssets(assetTotal)
    setLiabilities(liabilityTotal)
    setLoading(false)
  }

  const net = assets - liabilities

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  if (assets === 0 && liabilities === 0) {
    return (
      <EmptyState
        title="No financial data yet"
        description="Add property, investments or loans to see your net worth"
      />
    )
  }

  return (
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-base font-semibold">
        Family Net Worth
      </h1>

      {/* Net Worth Big Card */}
      <Card className="text-center space-y-2">
        <p className="text-xs text-zinc-500">Net Worth</p>

        <p
          className={`
            text-2xl font-semibold
            ${net >= 0 ? "text-green-600" : "text-red-600"}
          `}
        >
          ₹ {net.toLocaleString("en-IN")}
        </p>
      </Card>

      {/* Breakdown */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Assets */}
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp size={16} className="text-green-600" />
            Assets
          </div>

          <p className="text-lg font-semibold text-green-600">
            ₹ {assets.toLocaleString("en-IN")}
          </p>
        </Card>

        {/* Liabilities */}
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingDown size={16} className="text-red-600" />
            Liabilities
          </div>

          <p className="text-lg font-semibold text-red-600">
            ₹ {liabilities.toLocaleString("en-IN")}
          </p>
        </Card>

      </div>

      {/* Info */}
      <div className="text-xs text-zinc-400 text-center">
        Updates automatically from your Vault items
      </div>
    </div>
  )
}

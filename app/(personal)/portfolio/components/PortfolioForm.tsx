ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â PortfolioForm
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Add new asset
   - Pure form UI
   - No business logic
   - No DB
   - No calculations
   - Parent handles submit

   ARCHITECTURE
     page ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ usePortfolio.create()

   RULES
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ presentational only
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no fetch
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no supabase
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no math

   ========================================================= */

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

import type {
  AssetType,
  CreateAssetRequest,
} from "@/lib/api/portfolio/types"

/* =========================================================
   CONSTANTS
   ========================================================= */

const ASSET_TYPES: AssetType[] = [
  "stock",
  "mutual_fund",
  "etf",
  "crypto",
  "gold",
  "real_estate",
  "fd",
  "bond",
  "cash",
  "other",
]

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  loading?: boolean
  onSubmit: (payload: CreateAssetRequest) => Promise<void>
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioForm({
  loading,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateAssetRequest>({
    name: "",
    type: "stock",
    quantity: 0,
    buy_price: 0,
    current_price: 0,
  })

  const set = (k: keyof CreateAssetRequest, v: any) =>
    setForm((s) => ({ ...s, [k]: v }))

  const handleSubmit = async () => {
    await onSubmit(form)

    /* reset (UI only) */
    setForm({
      name: "",
      type: "stock",
      quantity: 0,
      buy_price: 0,
      current_price: 0,
    })
  }

  return (
    <Card className="p-6 space-y-4 rounded-2xl">
      <h2 className="font-medium">Add Asset</h2>

      <div className="grid md:grid-cols-5 gap-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="border rounded p-2"
        />

        <select
          value={form.type}
          onChange={(e) =>
            set("type", e.target.value as AssetType)
          }
          className="border rounded p-2"
        >
          {ASSET_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            set("quantity", Number(e.target.value))
          }
          className="border rounded p-2"
        />

        <input
          type="number"
          placeholder="Buy Price"
          value={form.buy_price}
          onChange={(e) =>
            set("buy_price", Number(e.target.value))
          }
          className="border rounded p-2"
        />

        <input
          type="number"
          placeholder="Current Price"
          value={form.current_price}
          onChange={(e) =>
            set("current_price", Number(e.target.value))
          }
          className="border rounded p-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Asset"}
      </button>
    </Card>
  )
}

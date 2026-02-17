ï»¿"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

import {
  Sparkles,
  ShieldCheck,
  Landmark,
  Banknote,
  TrendingUp,
} from "lucide-react"

/* =================================================
   SMART INSIGHTS CARD ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Phase 8 (AI Intelligence UI)

   Purpose:
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ shows proactive advice (not just alerts)
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ fetches /api/vault/insights
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ lightweight + fast
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ read-only
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ safe to mount on dashboard

   Types:
   tax | insurance | loan | wealth
================================================= */

type Insight = {
  type: "tax" | "insurance" | "loan" | "wealth"
  message: string
}

export default function SmartInsights() {
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<Insight[]>([])

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const res = await fetch("/api/vault/insights")
      const data = await res.json()
      setInsights(data || [])
    } finally {
      setLoading(false)
    }
  }

  /* ================= HELPERS ================= */

  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "tax":
        return <Landmark size={14} />
      case "insurance":
        return <ShieldCheck size={14} />
      case "loan":
        return <Banknote size={14} />
      case "wealth":
        return <TrendingUp size={14} />
      default:
        return <Sparkles size={14} />
    }
  }

  /* ================= UI ================= */

  if (loading) return null
  if (!insights.length) return null

  return (
    <Card className="space-y-3">

      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles size={14} />
        Smart Insights
      </div>

      <div className="space-y-2">
        {insights.map((i, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 text-xs text-zinc-600"
          >
            <span className="mt-0.5 opacity-70">
              {getIcon(i.type)}
            </span>

            <span>{i.message}</span>
          </div>
        ))}
      </div>

    </Card>
  )
}

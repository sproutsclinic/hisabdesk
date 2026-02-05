"use client"

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
   SMART INSIGHTS CARD — Phase 8 (AI Intelligence UI)

   Purpose:
   ✅ shows proactive advice (not just alerts)
   ✅ fetches /api/vault/insights
   ✅ lightweight + fast
   ✅ read-only
   ✅ safe to mount on dashboard

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

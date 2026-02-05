"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import EmptyState from "@/components/ui/EmptyState"

import {
  CalendarClock,
  Shield,
  Banknote,
  Landmark,
} from "lucide-react"

/* =================================================
   VAULT TIMELINE — Upcoming Money Events

   Purpose:
   ✅ shows ALL upcoming reminders
   ✅ premiums, EMI, maturity
   ✅ sorted by date
   ✅ single place to plan cashflow
   ✅ fintech "calendar view"

   Route:
   /vault/timeline

   ZERO breaking changes
================================================= */

type Reminder = {
  id: string
  reminder_date: string
  type: string
  vault_items?: {
    title: string
    category: string
  }
}

export default function VaultTimelinePage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Reminder[]>([])

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)

    const { data } = await supabase
      .from("reminders")
      .select(`
        id,
        reminder_date,
        type,
        vault_items(title, category)
      `)
      .eq("status", "pending")
      .order("reminder_date", { ascending: true })

    setItems(data || [])
    setLoading(false)
  }

  /* ================= HELPERS ================= */

  const getIcon = (type: string) => {
    if (type === "premium") return <Shield size={14} />
    if (type === "emi") return <Banknote size={14} />
    return <Landmark size={14} />
  }

  const getLabel = (type: string) => {
    if (type === "premium") return "Premium"
    if (type === "emi") return "EMI"
    if (type === "maturity") return "Maturity"
    return "Reminder"
  }

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  if (items.length === 0) {
    return (
      <EmptyState
        title="No upcoming events"
        description="Premiums, EMIs and maturity dates will appear here"
      />
    )
  }

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold">
        <CalendarClock size={16} />
        Upcoming Financial Timeline
      </div>

      {/* List */}
      <div className="space-y-3">

        {items.map((r) => (
          <Card
            key={r.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">

              <div className="text-zinc-600">
                {getIcon(r.type)}
              </div>

              <div>
                <p className="text-sm font-medium">
                  {r.vault_items?.title}
                </p>

                <p className="text-xs text-zinc-500">
                  {getLabel(r.type)}
                </p>
              </div>
            </div>

            <span className="text-xs text-zinc-500">
              {new Date(r.reminder_date).toLocaleDateString("en-IN")}
            </span>
          </Card>
        ))}

      </div>

      <p className="text-xs text-zinc-400 text-center">
        Plan ahead • Avoid penalties • Stay stress-free
      </p>
    </div>
  )
}

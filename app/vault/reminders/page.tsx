"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import EmptyState from "@/components/ui/EmptyState"
import { useToast } from "@/components/ui/toast"

/* =================================================
   REMINDER CENTER — Retention Engine

   Purpose:
   ✅ premium due alerts
   ✅ EMI alerts
   ✅ maturity reminders
   ✅ daily habit screen
   ✅ women-friendly clarity

   Tables:
   reminders
   vault_items

================================================= */

type Reminder = {
  id: string
  reminder_date: string
  type: string
  status: string
  vault_items: {
    title: string
    category: string
  }
}

export default function VaultRemindersPage() {
  const toast = useToast()

  const [items, setItems] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)

    const { data } = await supabase
      .from("reminders")
      .select(`
        *,
        vault_items (
          title,
          category
        )
      `)
      .order("reminder_date", { ascending: true })

    setItems(data || [])
    setLoading(false)
  }

  /* ================= MARK DONE ================= */

  const markDone = async (id: string) => {
    await supabase
      .from("reminders")
      .update({ status: "done" })
      .eq("id", id)

    toast.success("Marked done")
    load()
  }

  /* ================= HELPERS ================= */

  const today = new Date()

  const getBadge = (dateStr: string) => {
    const d = new Date(dateStr)
    const diff = Math.ceil(
      (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diff < 0) return "Overdue"
    if (diff <= 3) return "Soon"
    return "Upcoming"
  }

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  if (items.length === 0) {
    return (
      <EmptyState
        title="No reminders yet"
        description="Premiums, EMIs & maturities will appear here"
      />
    )
  }

  return (
    <div className="space-y-6">

      <h1 className="text-base font-semibold">
        Reminders
      </h1>

      <div className="grid gap-4">

        {items.map((r) => {
          const badge = getBadge(r.reminder_date)

          return (
            <Card key={r.id} className="space-y-2">

              <div className="flex justify-between items-start gap-3">

                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {r.vault_items?.title}
                  </p>

                  <p className="text-xs text-zinc-500 capitalize">
                    {r.vault_items?.category} • {r.type}
                  </p>
                </div>

                <span
                  className={`
                    text-[11px] px-2 py-1 rounded-full
                    ${
                      badge === "Overdue"
                        ? "bg-red-100 text-red-700"
                        : badge === "Soon"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-zinc-100 text-zinc-600"
                    }
                  `}
                >
                  {badge}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">

                <span>
                  Due:{" "}
                  {new Date(r.reminder_date).toLocaleDateString(
                    "en-IN"
                  )}
                </span>

                {r.status !== "done" && (
                  <button
                    onClick={() => markDone(r.id)}
                    className="text-green-600 font-medium"
                  >
                    Mark done
                  </button>
                )}
              </div>

            </Card>
          )
        })}
      </div>
    </div>
  )
}

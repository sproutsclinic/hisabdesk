"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/*
=========================================================
TAX SUGGESTIONS PANEL
Phase B — Day 11

Dashboard advisory widget

Features:
✓ Calls /api/ai/tax-suggestions
✓ Priority sorting (high → low)
✓ Clean advisory cards
✓ Loading states
✓ Empty state
✓ Production safe

Drop-in usage:

<TaxSuggestionsPanel />

=========================================================
*/

type Suggestion = {
  id: string
  title: string
  message: string
  impact?: number
  priority: "high" | "medium" | "low"
}

export default function TaxSuggestionsPanel() {
  const [items, setItems] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch("/api/ai/tax-suggestions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })

    const json = await res.json()

    setItems(json?.suggestions || [])
    setLoading(false)
  }

  /* ====================================================== */

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Tax Saving Insights
        </h2>

        <button
          onClick={load}
          className="text-xs text-gray-500 hover:text-black"
        >
          Refresh
        </button>
      </div>

      {/* BODY */}
      <div className="p-4 space-y-3">
        {loading && (
          <div className="text-sm text-gray-400">
            Analyzing your taxes…
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-sm text-gray-400">
            No suggestions right now. You're doing great 👍
          </div>
        )}

        {!loading &&
          items.map((s) => (
            <SuggestionCard key={s.id} s={s} />
          ))}
      </div>
    </div>
  )
}

/* ====================================================== */

function SuggestionCard({ s }: { s: Suggestion }) {
  const styles: Record<string, string> = {
    high: "border-red-200 bg-red-50",
    medium: "border-yellow-200 bg-yellow-50",
    low: "border-gray-200 bg-gray-50",
  }

  const badge: Record<string, string> = {
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-gray-600",
  }

  return (
    <div
      className={`rounded-lg border p-3 ${styles[s.priority]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{s.title}</p>
          <p className="text-xs mt-1 text-gray-600">
            {s.message}
          </p>

          {s.impact ? (
            <p className="mt-2 text-xs font-medium text-black">
              Impact: ₹{" "}
              {new Intl.NumberFormat("en-IN").format(s.impact)}
            </p>
          ) : null}
        </div>

        <span
          className={`text-xs font-semibold uppercase ${badge[s.priority]}`}
        >
          {s.priority}
        </span>
      </div>
    </div>
  )
}

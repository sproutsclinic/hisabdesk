"use client"

import { useState, useEffect } from "react"

/*
=========================================================
GST PERIOD SELECTOR
Phase A — Day 7 (UI Polish)

Purpose:
✓ Month selector
✓ Quick presets (This month / Last month)
✓ Emits YYYY-MM format
✓ Enterprise reusable
✓ Zero business logic

Usage:

<GSTPeriodSelector
  value={period}
  onChange={setPeriod}
/>
=========================================================
*/

interface Props {
  value: string // YYYY-MM
  onChange: (period: string) => void
}

export default function GSTPeriodSelector({
  value,
  onChange,
}: Props) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  function setCurrentMonth() {
    const d = new Date()
    const m = format(d)
    setLocal(m)
    onChange(m)
  }

  function setLastMonth() {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    const m = format(d)
    setLocal(m)
    onChange(m)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-white p-3 shadow-sm">
      <span className="text-sm font-medium text-gray-600">
        Period
      </span>

      <input
        type="month"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value)
          onChange(e.target.value)
        }}
        className="rounded-lg border px-3 py-2 text-sm"
      />

      <button
        onClick={setCurrentMonth}
        className="rounded-lg border px-3 py-2 text-xs hover:bg-gray-50"
      >
        This Month
      </button>

      <button
        onClick={setLastMonth}
        className="rounded-lg border px-3 py-2 text-xs hover:bg-gray-50"
      >
        Last Month
      </button>
    </div>
  )
}

/* ====================================================== */

function format(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

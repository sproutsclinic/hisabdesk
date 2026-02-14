"use client"

import { useMemo } from "react"

type Summary = {
  matched?: number
  partial?: number
  mismatch?: number
  missing?: number
  duplicate?: number
  total?: number

  classification_breakup?: {
    b2b?: number
    b2c_large?: number
    b2c_small?: number
    export?: number
    reverse_charge?: number
    nil_rated?: number
    exempt?: number
    non_gst?: number
    unknown?: number
  }
}

interface Props {
  summary: Summary | null
}

/*
=========================================================
GST OVERVIEW CARDS
Enterprise UI
No external deps
Server-safe
Reusable dashboard widget

Used in:
app/gst/page.tsx

Shows:
- Total invoices
- Reconciliation health
- Classification breakup
- Compliance readiness
=========================================================
*/

export default function GSTOverviewCards({ summary }: Props) {
  const metrics = useMemo(() => {
    const total = summary?.total || 0
    const matched = summary?.matched || 0
    const mismatch = summary?.mismatch || 0
    const missing = summary?.missing || 0
    const partial = summary?.partial || 0

    const compliance =
      total === 0 ? 100 : Math.round((matched / total) * 100)

    return {
      total,
      matched,
      mismatch,
      missing,
      partial,
      compliance,
    }
  }, [summary])

  const cls = summary?.classification_breakup || {}

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* TOTAL */}
      <Card
        title="Total Invoices"
        value={metrics.total}
        subtitle="GST period"
      />

      {/* MATCHED */}
      <Card
        title="Matched"
        value={metrics.matched}
        subtitle={`${metrics.compliance}% compliant`}
        positive
      />

      {/* ISSUES */}
      <Card
        title="Issues"
        value={metrics.mismatch + metrics.missing + metrics.partial}
        subtitle="Mismatch / Missing / Partial"
        danger
      />

      {/* CLASSIFICATION */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          Classification
        </h3>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <Row label="B2B" value={cls.b2b} />
          <Row label="B2C Large" value={cls.b2c_large} />
          <Row label="B2C Small" value={cls.b2c_small} />
          <Row label="Export" value={cls.export} />
          <Row label="RCM" value={cls.reverse_charge} />
          <Row label="Nil" value={cls.nil_rated} />
        </div>
      </div>
    </div>
  )
}

/* ====================================================== */

function Card({
  title,
  value,
  subtitle,
  positive,
  danger,
}: {
  title: string
  value?: number
  subtitle?: string
  positive?: boolean
  danger?: boolean
}) {
  const color = positive
    ? "text-green-600"
    : danger
    ? "text-red-600"
    : "text-gray-900"

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value || 0}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value?: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || 0}</span>
    </div>
  )
}

"use client"

import { useMemo } from "react"

/*
=========================================================
GST SUMMARY CHARTS
Phase A — Day 7 (UI Polish)

Lightweight
No chart libraries (bundle safe)
Pure CSS bars
Fast rendering

Shows:
✓ Reconciliation health
✓ Classification breakup
✓ Compliance %

Drop-in dashboard visual clarity
=========================================================
*/

interface Props {
  summary: {
    matched?: number
    partial?: number
    mismatch?: number
    missing?: number
    duplicate?: number
    total?: number
    classification_breakup?: Record<string, number>
  } | null
}

export default function GSTSummaryCharts({ summary }: Props) {
  const data = useMemo(() => {
    const total = summary?.total || 0

    const rec = {
      matched: summary?.matched || 0,
      partial: summary?.partial || 0,
      mismatch: summary?.mismatch || 0,
      missing: summary?.missing || 0,
      duplicate: summary?.duplicate || 0,
    }

    const cls = summary?.classification_breakup || {}

    const compliance =
      total === 0 ? 100 : Math.round((rec.matched / total) * 100)

    return { total, rec, cls, compliance }
  }, [summary])

  if (!summary) return null

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* ============================================= */}
      {/* RECONCILIATION HEALTH */}
      {/* ============================================= */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-500">
          Reconciliation Health
        </h3>

        <Bar
          label="Matched"
          value={data.rec.matched}
          total={data.total}
          color="bg-green-500"
        />

        <Bar
          label="Partial"
          value={data.rec.partial}
          total={data.total}
          color="bg-yellow-500"
        />

        <Bar
          label="Mismatch"
          value={data.rec.mismatch}
          total={data.total}
          color="bg-red-500"
        />

        <Bar
          label="Missing"
          value={data.rec.missing}
          total={data.total}
          color="bg-gray-400"
        />

        <Bar
          label="Duplicate"
          value={data.rec.duplicate}
          total={data.total}
          color="bg-purple-500"
        />

        <div className="mt-4 text-xs text-gray-400">
          Compliance Score:{" "}
          <span className="font-semibold text-gray-700">
            {data.compliance}%
          </span>
        </div>
      </div>

      {/* ============================================= */}
      {/* CLASSIFICATION */}
      {/* ============================================= */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-500">
          Invoice Classification
        </h3>

        {Object.entries(data.cls).map(([k, v]) => (
          <Bar
            key={k}
            label={formatLabel(k)}
            value={Number(v)}
            total={data.total}
            color="bg-black"
          />
        ))}
      </div>
    </div>
  )
}

/* ====================================================== */

function Bar({
  label,
  value,
  total,
  color,
}: {
  label: string
  value: number
  total: number
  color: string
}) {
  const percent =
    total === 0 ? 0 : Math.round((value / total) * 100)

  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span>
          {value} ({percent}%)
        </span>
      </div>

      <div className="h-2 w-full rounded bg-gray-100">
        <div
          className={`h-2 rounded ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function formatLabel(key: string) {
  return key
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

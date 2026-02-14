"use client"

import { useState } from "react"

interface Props {
  onSync?: () => Promise<void> | void
  onReconcile?: () => Promise<void> | void
  onClassify?: () => Promise<void> | void
  loading?: boolean
}

/*
=========================================================
GST ACTIONS BAR
Enterprise safe
Reusable
No business logic inside
Only triggers callbacks

Used in:
app/gst/page.tsx

Actions:
- GST Sync
- Reconcile
- Classify
- Refresh

Design:
Clean toolbar like Stripe/Notion
=========================================================
*/

export default function GSTActionsBar({
  onSync,
  onReconcile,
  onClassify,
  loading,
}: Props) {
  const [busy, setBusy] = useState<string | null>(null)

  const handle = async (
    name: string,
    fn?: () => Promise<void> | void
  ) => {
    if (!fn) return
    try {
      setBusy(name)
      await fn()
    } finally {
      setBusy(null)
    }
  }

  const isBusy = (name: string) => busy === name || loading

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-gray-700">
        GST Compliance Tools
      </div>

      <div className="flex flex-wrap gap-2">
        <ActionButton
          label="Sync GST"
          busy={isBusy("sync")}
          onClick={() => handle("sync", onSync)}
        />

        <ActionButton
          label="Reconcile"
          busy={isBusy("reconcile")}
          onClick={() => handle("reconcile", onReconcile)}
        />

        <ActionButton
          label="Classify"
          busy={isBusy("classify")}
          onClick={() => handle("classify", onClassify)}
        />

        <ActionButton
          label="Refresh"
          busy={false}
          onClick={() => window.location.reload()}
          secondary
        />
      </div>
    </div>
  )
}

/* ====================================================== */

function ActionButton({
  label,
  busy,
  onClick,
  secondary,
}: {
  label: string
  busy?: boolean
  onClick?: () => void
  secondary?: boolean
}) {
  const base =
    "px-4 py-2 text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"

  const style = secondary
    ? "border bg-white hover:bg-gray-50"
    : "bg-black text-white hover:bg-gray-800"

  return (
    <button
      disabled={busy}
      onClick={onClick}
      className={`${base} ${style}`}
    >
      {busy ? "Processing..." : label}
    </button>
  )
}

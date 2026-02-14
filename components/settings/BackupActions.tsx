"use client"

import { useState } from "react"
import { downloadBackup } from "@/lib/backup/download"
import { restoreBackup } from "@/lib/import/restore"

/*
  PHASE 18 — Backup Actions Component

  Improved reusable UI
  Uses helpers instead of raw fetch
*/

export default function BackupActions() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    await downloadBackup()
    setLoading(false)
  }

  async function handleImport() {
    if (!file) return

    setLoading(true)

    try {
      await restoreBackup(file)
      alert("Backup restored successfully")
      setFile(null)
    } catch {
      alert("Restore failed")
    }

    setLoading(false)
  }

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
      <h2 className="text-sm font-semibold">Backup & Restore</h2>

      {/* Export */}
      <div>
        <button
          onClick={handleExport}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-xl text-sm"
        >
          Export Backup
        </button>
      </div>

      {/* Import */}
      <div className="space-y-3">
        <input
          type="file"
          accept="application/json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />

        <button
          onClick={handleImport}
          disabled={!file || loading}
          className="border px-4 py-2 rounded-xl text-sm"
        >
          Import Backup
        </button>
      </div>
    </div>
  )
}

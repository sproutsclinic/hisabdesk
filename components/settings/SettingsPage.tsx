ï»¿"use client"

import { useState } from "react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  async function exportBackup() {
    setLoading(true)
    window.location.href = "/api/admin/export/backup"
    setLoading(false)
  }

  async function importBackup() {
    if (!file) return

    setLoading(true)

    const text = await file.text()

    await fetch("/api/admin/import/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: text,
    })

    alert("Backup restored successfully")
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <h1 className="text-lg font-semibold">Settings</h1>

      {/* Backup */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold mb-4">Data Backup</h2>

        <button
          onClick={exportBackup}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-xl text-sm"
        >
          Export Backup
        </button>
      </div>

      {/* Restore */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold mb-4">Restore Backup</h2>

        <input
          type="file"
          accept="application/json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-3 text-sm"
        />

        <button
          onClick={importBackup}
          disabled={!file || loading}
          className="border px-4 py-2 rounded-xl text-sm"
        >
          Import Backup
        </button>
      </div>
    </div>
  )
}

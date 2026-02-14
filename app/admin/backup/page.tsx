"use client"

/**
 * =========================================================
 * Admin Backup & Restore Console
 * HisabDesk – Enterprise Disaster Recovery UI
 * =========================================================
 *
 * ROUTE
 *   /admin/backup
 *
 * PURPOSE
 * Admin level:
 *
 *   ✓ export organization backup (JSON)
 *   ✓ restore backup file
 *   ✓ disaster recovery
 *   ✓ migration support
 *
 * CONNECTS TO
 *   lib/backup/backup-service.ts
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  exportWorkspace,
  restoreWorkspace,
} from "@/lib/backup/backup-service"

type Org = {
  id: string
  name: string
}

export default function AdminBackupPage() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(false)

  /* ======================================================
     LOAD ORGS
  ====================================================== */

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("organizations")
        .select("id, name")
        .order("created_at", { ascending: false })

      setOrgs(data || [])
    }

    load()
  }, [])

  /* ======================================================
     EXPORT
  ====================================================== */

  async function handleExport() {
    if (!selected) return

    setLoading(true)

    const backup = await exportWorkspace(selected)

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    )

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `backup-${selected}.json`
    a.click()

    URL.revokeObjectURL(url)

    setLoading(false)
  }

  /* ======================================================
     RESTORE
  ====================================================== */

  async function handleRestore(file: File) {
    if (!selected) return

    if (
      !confirm(
        "Restore will overwrite current data. Continue?"
      )
    )
      return

    setLoading(true)

    const text = await file.text()
    const json = JSON.parse(text)

    await restoreWorkspace(selected, json)

    alert("Restore completed")

    setLoading(false)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold">
          Backup & Restore
        </h1>
        <p className="text-sm text-gray-500">
          Disaster recovery tools
        </p>
      </div>

      {/* SELECT ORG */}
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="border px-3 py-2 rounded-lg w-full"
      >
        <option value="">Select organization</option>
        {orgs.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={handleExport}
          disabled={!selected || loading}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Export Backup
        </button>

        <label className="border px-4 py-2 rounded-lg cursor-pointer">
          Restore
          <input
            type="file"
            className="hidden"
            accept=".json"
            onChange={(e) =>
              e.target.files &&
              handleRestore(e.target.files[0])
            }
          />
        </label>
      </div>

      {loading && (
        <p className="text-sm text-gray-500">
          Processing...
        </p>
      )}
    </div>
  )
}

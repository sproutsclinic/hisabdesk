"use client"

import { useState } from "react"

/*
  PHASE 18 — Settings Navigation Tabs

  Reusable section switcher for enterprise settings
*/

type Tab = "backup" | "activity"

export default function SettingsNav({
  backup,
  activity,
}: {
  backup: React.ReactNode
  activity: React.ReactNode
}) {
  const [tab, setTab] = useState<Tab>("backup")

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("backup")}
          className={`px-4 py-2 rounded-xl text-sm border ${
            tab === "backup" ? "bg-black text-white" : ""
          }`}
        >
          Backup & Restore
        </button>

        <button
          onClick={() => setTab("activity")}
          className={`px-4 py-2 rounded-xl text-sm border ${
            tab === "activity" ? "bg-black text-white" : ""
          }`}
        >
          Activity History
        </button>
      </div>

      {/* Content */}
      {tab === "backup" && backup}
      {tab === "activity" && activity}
    </div>
  )
}

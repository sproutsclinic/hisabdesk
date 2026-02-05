"use client"

import Link from "next/link"

export default function UpgradePrompt({
  show
}: {
  show: boolean
}) {
  if (!show) return null

  return (
    <div className="card bg-black text-white flex items-center justify-between">

      <div>
        <p className="text-sm font-medium">
          Unlock AI Tax Advisor + Reports
        </p>
        <p className="text-xs opacity-80">
          Save more taxes with smart insights
        </p>
      </div>

      <Link
        href="/billing"
        className="bg-white text-black px-4 py-2 rounded-lg text-sm"
      >
        Upgrade
      </Link>
    </div>
  )
}

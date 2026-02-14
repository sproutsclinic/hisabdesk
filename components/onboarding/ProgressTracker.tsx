"use client"

import { useEffect, useState } from "react"
import { ONBOARDING_STEPS } from "@/lib/onboarding/config"
import { getOnboardingProgress } from "@/lib/onboarding/storage"

export default function ProgressTracker() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const progress = getOnboardingProgress()
    const done = progress.completed.length
    const total = ONBOARDING_STEPS.length

    setPercent(Math.round((done / total) * 100))
  }, [])

  if (percent === 100) return null

  return (
    <div className="w-full bg-white border rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600">
          Setup Progress
        </span>
        <span className="text-xs font-semibold">{percent}%</span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ONBOARDING_STEPS } from "@/lib/onboarding/config"
import {
  getOnboardingProgress,
  markStepCompleted,
} from "@/lib/onboarding/storage"

export default function OnboardingChecklist() {
  const router = useRouter()

  const [completed, setCompleted] = useState<string[]>([])
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const progress = getOnboardingProgress()
    setCompleted(progress.completed)
  }, [])

  const total = ONBOARDING_STEPS.length
  const done = completed.length
  const percent = Math.round((done / total) * 100)

  function handleStep(stepId: string, route: string) {
    markStepCompleted(stepId)
    setCompleted((prev) =>
      prev.includes(stepId) ? prev : [...prev, stepId]
    )
    router.push(route)
  }

  if (!open) return null

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-xl rounded-2xl border p-4 z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Getting Started</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-gray-500"
        >
          ✕
        </button>
      </div>

      <div className="mb-3">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs mt-1 text-gray-600">
          {done}/{total} completed • {percent}%
        </p>
      </div>

      <ul className="space-y-2">
        {ONBOARDING_STEPS.map((step) => {
          const isDone = completed.includes(step.id)

          return (
            <li key={step.id}>
              <button
                onClick={() => handleStep(step.id, step.route)}
                className="w-full text-left p-2 rounded-lg border hover:bg-gray-50 flex items-start gap-2"
              >
                <span className="mt-0.5">
                  {isDone ? "✅" : "⬜"}
                </span>

                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-gray-500">
                    {step.description}
                  </p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

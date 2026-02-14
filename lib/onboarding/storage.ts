"use client"

const KEY = "hisabdesk_onboarding_progress"

export type OnboardingProgress = {
  completed: string[]
}

function getDefault(): OnboardingProgress {
  return { completed: [] }
}

export function getOnboardingProgress(): OnboardingProgress {
  if (typeof window === "undefined") return getDefault()

  const raw = localStorage.getItem(KEY)
  if (!raw) return getDefault()

  try {
    return JSON.parse(raw)
  } catch {
    return getDefault()
  }
}

export function saveOnboardingProgress(progress: OnboardingProgress) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(progress))
}

export function markStepCompleted(stepId: string) {
  const progress = getOnboardingProgress()

  if (!progress.completed.includes(stepId)) {
    progress.completed.push(stepId)
    saveOnboardingProgress(progress)
  }
}

export function resetOnboarding() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}

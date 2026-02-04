export function hasCompletedOnboarding() {
  if (typeof window === "undefined") return true
  return localStorage.getItem("onboarding_done") === "true"
}

export function completeOnboarding() {
  localStorage.setItem("onboarding_done", "true")
}

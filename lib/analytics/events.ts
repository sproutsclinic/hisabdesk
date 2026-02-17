ï»¿/*
  PHASE 16 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Analytics Events Engine
  Lightweight internal tracking (no external SDK)

  Usage:
  trackEvent("signup_completed")
  trackEvent("payment_success", { amount: 999 })
*/

export type AnalyticsEvent =
  | "signup_completed"
  | "login"
  | "income_added"
  | "expense_added"
  | "tax_calculated"
  | "upgrade_clicked"
  | "payment_success"
  | "report_exported"

type Props = Record<string, any>

export async function trackEvent(
  event: AnalyticsEvent,
  props?: Props
) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        props,
      }),
    })
  } catch (err) {
    console.error("Analytics failed:", err)
  }
}

/**
 * =========================================================
 * Engagement + Product Analytics Tracker
 * HisabDesk – Enterprise Analytics Layer
 * =========================================================
 *
 * PURPOSE
 * Track:
 *   ✓ user activity
 *   ✓ funnels
 *   ✓ conversions
 *   ✓ feature usage
 *   ✓ retention
 *
 * Works for:
 *   ✓ dashboards
 *   ✓ admin metrics
 *   ✓ growth analytics
 *   ✓ billing insights
 *
 * DESIGN
 * Lightweight event tracker → Supabase table
 *
 * BENEFITS
 *   ✓ no external analytics cost
 *   ✓ privacy safe
 *   ✓ fully owned data
 *   ✓ SQL analytics ready
 *
 * SAFE
 * - works client + server
 * - no existing files modified
 *
 * REQUIRED TABLE (Supabase SQL)
 *
 * create table analytics_events (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid,
 *   event text not null,
 *   meta jsonb,
 *   created_at timestamp default now()
 * );
 *
 * =========================================================
 */

/* =========================================================
   TYPES
========================================================= */

export type AnalyticsEvent = {
  event: string
  meta?: Record<string, any>
}

/* =========================================================
   CORE TRACK (CLIENT SAFE)
========================================================= */

export async function trackEvent(
  supabase: any,
  userId: string | null,
  input: AnalyticsEvent
) {
  try {
    await supabase.from("analytics_events").insert({
      user_id: userId,
      event: input.event,
      meta: input.meta || {},
    })
  } catch {
    /* never break app */
  }
}

/* =========================================================
   COMMON PRESETS
========================================================= */

export function trackPageView(
  supabase: any,
  userId: string | null,
  page: string
) {
  return trackEvent(supabase, userId, {
    event: "page_view",
    meta: { page },
  })
}

export function trackSignup(
  supabase: any,
  userId: string
) {
  return trackEvent(supabase, userId, {
    event: "signup",
  })
}

export function trackProUpgrade(
  supabase: any,
  userId: string,
  amount: number
) {
  return trackEvent(supabase, userId, {
    event: "pro_upgrade",
    meta: { amount },
  })
}

export function trackExpenseAdded(
  supabase: any,
  userId: string,
  amount: number
) {
  return trackEvent(supabase, userId, {
    event: "expense_added",
    meta: { amount },
  })
}

export function trackIncomeAdded(
  supabase: any,
  userId: string,
  amount: number
) {
  return trackEvent(supabase, userId, {
    event: "income_added",
    meta: { amount },
  })
}

export function trackReportExport(
  supabase: any,
  userId: string
) {
  return trackEvent(supabase, userId, {
    event: "report_exported",
  })
}

/* =========================================================
   FUNNEL HELPER
========================================================= */

export async function trackFunnelStep(
  supabase: any,
  userId: string | null,
  funnel: string,
  step: string
) {
  return trackEvent(supabase, userId, {
    event: "funnel_step",
    meta: {
      funnel,
      step,
    },
  })
}

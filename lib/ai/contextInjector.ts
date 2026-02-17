ï»¿/**
 * =========================================================
 * Context Injector (AI Safety Layer)
 * HisabDesk AI Architecture
 * =========================================================
 *
 * PURPOSE
 * Injects structured, non-sensitive financial context
 * into prompts before they are sent to the model.
 *
 * This keeps:
 *  ? prompts consistent
 *  ? no raw DB objects leaked
 *  ? deterministic formatting
 *  ? audit-safe AI usage
 *
 * IMPORTANT
 * This file MUST remain pure.
 * No fetch / no supabase / no side-effects.
 */

export type AIContext = {
  userName?: string
  currency?: string
  period?: string
  module?: string
}

/* =========================================================
   MAIN
========================================================= */

export function injectContext(
  basePrompt: string,
  context?: AIContext
): string {
  if (!context) return basePrompt

  const lines: string[] = []

  if (context.userName) {
    lines.push(`User: ${context.userName}`)
  }

  if (context.currency) {
    lines.push(`Currency: ${context.currency}`)
  }

  if (context.period) {
    lines.push(`Period: ${context.period}`)
  }

  if (context.module) {
    lines.push(`Module: ${context.module}`)
  }

  if (!lines.length) return basePrompt

  const header =
    "---- Financial Context ----\n" +
    lines.join("\n") +
    "\n---------------------------\n\n"

  return header + basePrompt
}

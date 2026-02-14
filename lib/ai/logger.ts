// ==========================================================
// HisabDesk — AI Logger (Centralized Usage Logging)
// ----------------------------------------------------------
// PURPOSE
//   Single place to log ALL AI usage
//
//   Prevents:
//     ❌ duplicate logging logic
//     ❌ inconsistent inserts
//     ❌ routes manually writing ai_logs
//
//   Used by:
//     ✓ safeRunAI()
//     ✓ future analytics
//
//   RULE:
//     Only THIS file writes to ai_logs table
// ==========================================================

import { createClient } from "@/lib/supabase"

// ==========================================================
// TYPES
// ==========================================================

interface LogParams {
  userId: string
  module: string
  tokens?: number
  model?: string
  meta?: Record<string, any>
}

// ==========================================================
// CLIENT
// ==========================================================

const supabase = createClient()

// ==========================================================
// LOGGER
// ==========================================================

export async function logAIUsage(params: LogParams) {
  try {
    await supabase.from("ai_logs").insert({
      user_id: params.userId,
      module: params.module,
      tokens: params.tokens ?? 0,
      model: params.model ?? null,
      meta: params.meta ?? {},
      created_at: new Date().toISOString(),
    })
  } catch {
    // intentionally silent
    // logging must NEVER break AI flow
  }
}

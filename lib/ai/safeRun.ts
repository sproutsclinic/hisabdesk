// ==========================================================
// HisabDesk — Safe AI Runner (MANDATORY WRAPPER)
// ----------------------------------------------------------
// PURPOSE
//   Single safe entrypoint to call OpenAI
//
//   Combines:
//     ✓ guardAI()  → rate limit protection
//     ✓ runAI()    → actual OpenAI call
//     ✓ auto logging
//
//   So routes NEVER directly call runAI()
//
//   Instead use:
//
//     const result = await safeRunAI({
//       userId,
//       prompt,
//       type: "module"
//     })
//
//   This guarantees:
//     ✓ cost protection
//     ✓ consistent logging
//     ✓ zero duplication across routes
//
// ==========================================================

import { runAI } from "./openai"
import { guardAI } from "./guard"
import { createClient } from "@/lib/supabase"

// ==========================================================
// TYPES
// ==========================================================

export type AIRunType = "module" | "chat" | "heavy"

interface SafeRunParams {
  userId: string
  prompt: string
  type: AIRunType
  system?: string
  module: string // for logging
}

// ==========================================================
// CLIENT
// ==========================================================

const supabase = createClient()

// ==========================================================
// SAFE RUNNER
// ==========================================================

export async function safeRunAI(params: SafeRunParams) {
  // --------------------------------------------------------
  // 1. Guard (monthly budget protection)
  // --------------------------------------------------------

  await guardAI(params.userId)

  // --------------------------------------------------------
  // 2. Run AI
  // --------------------------------------------------------

  const result = await runAI({
    prompt: params.prompt,
    type: params.type,
    system: params.system,
  })

  // --------------------------------------------------------
  // 3. Log usage automatically
  // --------------------------------------------------------

  await supabase.from("ai_logs").insert({
    user_id: params.userId,
    module: params.module,
    tokens: result.usage?.total_tokens ?? 0,
  })

  return result
}

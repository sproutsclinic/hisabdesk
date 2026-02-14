// ==========================================================
// HisabDesk — AI Client (High-Level Entry for Routes)
// ----------------------------------------------------------
// PURPOSE
//   Final clean abstraction for ALL AI calls inside routes
//
//   This sits ABOVE:
//     safeRunAI()
//     contextInjector()
//     prompts
//
//   So routes only do:
//
//     const ai = createAI(user.id)
//     const text = await ai.module("...", "dashboard-summary")
//
//   Benefits:
//     ✓ zero repeated boilerplate
//     ✓ auto context injection
//     ✓ auto guard
//     ✓ auto logging
//     ✓ ultra clean routes
//
//   This becomes THE ONLY thing routes import
//
// ==========================================================

import { safeRunAI } from "./safeRunAI"
import { injectContext } from "./contextInjector"
import {
  FINANCE_SYSTEM_PROMPT,
  MODULE_INSIGHT_PROMPT,
  TAX_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
} from "./prompts"

import type { AIRunType } from "./types"

// ==========================================================
// FACTORY
// ==========================================================

export function createAI(userId: string) {
  // --------------------------------------------------------
  // CORE EXECUTOR
  // --------------------------------------------------------

  async function execute(params: {
    prompt: string
    type: AIRunType
    module: string
    system?: string
    inject?: boolean
  }) {
    let prompt = params.prompt

    // auto inject context unless disabled
    if (params.inject !== false) {
      prompt = await injectContext(userId, prompt)
    }

    const result = await safeRunAI({
      userId,
      prompt,
      type: params.type,
      module: params.module,
      system: params.system,
    })

    return result.text
  }

  // --------------------------------------------------------
  // PUBLIC HELPERS
  // --------------------------------------------------------

  return {
    // cheap summaries
    module(prompt: string, module: string) {
      return execute({
        prompt: `${prompt}\n\n${MODULE_INSIGHT_PROMPT}`,
        type: "module",
        module,
        system: FINANCE_SYSTEM_PROMPT,
      })
    },

    // chat assistant
    chat(prompt: string, module: string) {
      return execute({
        prompt,
        type: "chat",
        module,
        system: FINANCE_SYSTEM_PROMPT,
      })
    },

    // heavy reasoning (tax/planner)
    heavy(prompt: string, module: string, system?: string) {
      return execute({
        prompt,
        type: "heavy",
        module,
        system: system || PLANNER_SYSTEM_PROMPT,
      })
    },

    // tax specific shortcut
    tax(prompt: string, module: string) {
      return execute({
        prompt,
        type: "heavy",
        module,
        system: TAX_SYSTEM_PROMPT,
      })
    },
  }
}

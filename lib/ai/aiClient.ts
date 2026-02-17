ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â AI Client (Final Unified Layer)
// ----------------------------------------------------------
// PURPOSE
//   Clean helper wrapper for routes/services.
//
//   All AI execution MUST flow through safeRunAI().
//   No system prompts.
//   No "chat" mode.
//   Only standardized run types.
//
//   Allowed types:
//     "cheap"  ? fast utilities
//     "module" ? page insights
//     "heavy"  ? deep reasoning
// ==========================================================

import { safeRunAI } from "./safeRunAI"
import { injectContext } from "./contextInjector"

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
    type?: AIRunType
    module: string
    inject?: boolean
  }) {
    let prompt = params.prompt

    // Inject financial context unless explicitly disabled
    if (params.inject !== false) {
      prompt = await injectContext(prompt)
    }

    const result = await safeRunAI({
      userId,
      prompt,
      type: params.type ?? "cheap",
      module: params.module,
    })

    return result.text
  }

  // --------------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------------

  return {
    /**
     * Standard module insight (most common)
     */
    module(prompt: string, module: string) {
      return execute({
        prompt,
        type: "module",
        module,
      })
    },

    /**
     * Heavy reasoning (planner, projections, tax)
     */
    heavy(prompt: string, module: string) {
      return execute({
        prompt,
        type: "heavy",
        module,
      })
    },

    /**
     * Ultra-cheap quick helper (rare)
     */
    cheap(prompt: string, module: string) {
      return execute({
        prompt,
        type: "cheap",
        module,
      })
    },
  }
}

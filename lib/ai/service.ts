ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Service (Top-Level Facade)
// ==========================================================

import { createAI } from "./aiClient"

// ==========================================================
// FACTORY
// ==========================================================

export function getAI(userId: string) {
  return createAI(userId)
}

// ==========================================================
// OPTIONAL SHORTCUTS (for convenience)
// ==========================================================

export async function runModuleAI(
  userId: string,
  prompt: string,
  module: string
) {
  return getAI(userId).module(prompt, module)
}

/**
 * Chat mode was merged into "module" mode
 * to avoid duplicate pipelines.
 */
export async function runChatAI(
  userId: string,
  prompt: string,
  module: string
) {
  return getAI(userId).module(prompt, module)
}

export async function runHeavyAI(
  userId: string,
  prompt: string,
  module: string
) {
  return getAI(userId).heavy(prompt, module)
}

export async function runTaxAI(
  userId: string,
  prompt: string,
  module: string
) {
  // tax flows use heavy reasoning model now
  return getAI(userId).heavy(prompt, module)
}

// ==========================================================
// HisabDesk — AI Service (Top-Level Facade)
// ----------------------------------------------------------
// PURPOSE
//   FINAL public entrypoint for AI across the app
//
//   This is what the rest of the app should import.
//
//   Instead of:
//     import { createAI } from "@/lib/ai/aiClient"
//
//   Use:
//     import { getAI } from "@/lib/ai/service"
//
//   Why:
//     ✓ hides internal structure
//     ✓ future-proof (swap providers easily)
//     ✓ cleaner architecture boundary
//     ✓ business layer talks to service, not infra
//
//   LAYERING:
//
//   Routes / Modules
//        ↓
//     AI Service   ← THIS FILE
//        ↓
//     AI Client
//        ↓
//   safeRun → guard → openai
//
// ==========================================================

import { createAI } from "./aiClient"

// ==========================================================
// FACTORY
// ==========================================================

export function getAI(userId: string) {
  // future:
  //   could add:
  //   - caching
  //   - tracing
  //   - analytics
  //   - provider switching
  //   - fallbacks
  //
  // without touching routes

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

export async function runChatAI(
  userId: string,
  prompt: string,
  module: string
) {
  return getAI(userId).chat(prompt, module)
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
  return getAI(userId).tax(prompt, module)
}

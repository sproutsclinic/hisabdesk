// ==========================================================
// HisabDesk — AI Provider Abstraction
// ----------------------------------------------------------
// PURPOSE
//   Provider abstraction layer for AI engines
//
//   Today:
//     OpenAI
//
//   Tomorrow:
//     Anthropic / Groq / Local / Azure / etc.
//
//   By routing ALL calls through this interface,
//   you can switch providers without touching:
//
//     ✓ routes
//     ✓ services
//     ✓ business logic
//
//   Only this file + openai.ts change.
//
// ==========================================================

import type { AIRunType, AIResult } from "./types"
import { runAI as openaiRun } from "./openai"

// ==========================================================
// TYPES
// ==========================================================

export interface AIProvider {
  run(params: {
    prompt: string
    type: AIRunType
    system?: string
  }): Promise<AIResult>
}

// ==========================================================
// OPENAI PROVIDER (current)
// ==========================================================

class OpenAIProvider implements AIProvider {
  async run(params: {
    prompt: string
    type: AIRunType
    system?: string
  }) {
    return openaiRun(params)
  }
}

// ==========================================================
// FACTORY
// ==========================================================

let provider: AIProvider = new OpenAIProvider()

export function getProvider(): AIProvider {
  return provider
}

// ==========================================================
// FUTURE EXTENSIBILITY
// ==========================================================
//
// Example:
//
// export function setProvider(p: AIProvider) {
//   provider = p
// }
//
// Then you could swap engines at runtime.
//
// ==========================================================

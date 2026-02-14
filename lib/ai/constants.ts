// ==========================================================
// HisabDesk — AI Constants (Single Source of Truth)
// ==========================================================

// ==========================================================
// MODEL STRATEGY
// ==========================================================

export const AI_MODELS = {
  CHEAP: "gpt-3.5-turbo",
  HEAVY: "gpt-4-turbo",
} as const

// ==========================================================
// TOKEN LIMITS
// ==========================================================

export const AI_TOKENS = {
  MODULE: 500,
  CHAT: 1200,
  HEAVY: 1200,
} as const

// ==========================================================
// ✅ BACKWARD COMPATIBILITY (IMPORTANT)
// ----------------------------------------------------------
// openai.ts expects these names
// We alias instead of renaming
// ==========================================================

export const AI_TOKEN_LIMITS = AI_TOKENS

export const AI_DEFAULT_MAX_OUTPUT_TOKENS = 500

// ==========================================================
// TEMPERATURE
// ==========================================================

export const AI_TEMPERATURE = 0.3

// ==========================================================
// COST CONTROL
// ==========================================================

export const AI_COST = {
  MONTHLY_LIMIT_DOLLARS: 5,
  COST_PER_1K_TOKENS: 0.01,
} as const

// ==========================================================
// PROMPT GUARDS
// ==========================================================

export const AI_LIMITS = {
  MAX_PROMPT_CHARS: 4000,
} as const
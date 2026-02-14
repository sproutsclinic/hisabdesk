// ==========================================================
// HisabDesk — AI Types (Central Contracts)
// ----------------------------------------------------------
// PURPOSE
//   Single source of truth for ALL AI-related types
//
//   Prevents:
//     ❌ duplicate type definitions
//     ❌ inconsistent AI calls
//     ❌ magic strings across routes
//
//   All AI files should import types from here.
//
//   Example:
//     import { AIRunType, AIResult } from "@/lib/ai/types"
//
// ==========================================================

// ==========================================================
// MODEL POLICY
// ----------------------------------------------------------
// module  → cheap (GPT-3.5 class)
// chat    → medium tokens (assistant conversations)
// heavy   → GPT-4 (planner/tax only)
// ==========================================================

export type AIRunType = "module" | "chat" | "heavy"

// ==========================================================
// CORE OPENAI RESULT
// ==========================================================

export interface AIUsage {
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
}

export interface AIResult {
  text: string
  usage?: AIUsage
}

// ==========================================================
// SAFE RUN PARAMS
// ==========================================================

export interface SafeRunParams {
  userId: string
  prompt: string
  type: AIRunType
  system?: string
  module: string
}

// ==========================================================
// CONTEXT TYPES (used by context builder)
// ==========================================================

export interface AIContextNumbers {
  income?: number
  expense?: number
  savingsRate?: number
  networth?: number
  runwayMonths?: number
  [key: string]: number | string | undefined
}

export interface AIContextPayload {
  summary: string
  numbers?: AIContextNumbers
}

// ==========================================================
// ROUTE RESPONSE STANDARD (recommended)
// ==========================================================

export interface AIResponse {
  insights?: string
  reply?: string
  error?: string
}

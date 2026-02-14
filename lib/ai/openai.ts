// ==========================================================
// HisabDesk — OpenAI Runner (LOW LEVEL ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Single low-level OpenAI executor
//
//   ⚠️ IMPORTANT
//   Routes MUST NOT import this directly.
//   Use:
//       safeRunAI()
//   instead.
//
//   This file only:
//     ✓ selects model
//     ✓ applies token limits
//     ✓ applies temperature
//     ✓ returns normalized result
//
// ==========================================================

import OpenAI from "openai"

import {
  AI_TOKEN_LIMITS,
  AI_TEMPERATURE,
  AI_MODELS,
  AI_DEFAULT_MAX_OUTPUT_TOKENS,
} from "./constants"

import type {
  AIRunType,
  AIResult,
} from "./types"

// ==========================================================
// CLIENT
// ==========================================================

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// ==========================================================
// INTERNAL — SELECT MODEL
// ==========================================================

function getModel(type: AIRunType) {
  return AI_MODELS[type]
}

function getMaxTokens(type: AIRunType) {
  return AI_TOKEN_LIMITS[type]
}

// ==========================================================
// CORE RUNNER
// ==========================================================
//
// DO NOT USE DIRECTLY IN ROUTES
// Use safeRunAI()
// ==========================================================

export async function runAI(params: {
  prompt: string
  type: AIRunType
  system?: string
}): Promise<AIResult> {
  const model = getModel(params.type)
  const maxTokens = getMaxTokens(params.type)

  const messages = []

  if (params.system) {
    messages.push({
      role: "system",
      content: params.system,
    })
  }

  messages.push({
    role: "user",
    content: params.prompt,
  })

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: AI_TEMPERATURE,
    max_tokens: Math.min(
      maxTokens,
      AI_DEFAULT_MAX_OUTPUT_TOKENS
    ),
  })

  const text =
    response.choices?.[0]?.message?.content?.trim() || ""

  return {
    text,
    usage: response.usage,
  }
}
// ==========================================================
// BACKWARD COMPATIBILITY LAYER
// ----------------------------------------------------------
// Many routes still import legacy helpers.
// We map them safely to runAI so build does not break.
// This allows gradual migration instead of mass refactor.
// ==========================================================

export async function runChat(prompt: string) {
  const res = await runAI({ prompt, type: "chat" })
  return res.text
}

export async function runCheapChat(prompt: string) {
  const res = await runAI({ prompt, type: "module" })
  return res.text
}

export async function runChatModel(params: { prompt: string }) {
  const res = await runAI({ prompt: params.prompt, type: "chat" })
  return res.text
}
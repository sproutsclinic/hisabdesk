// ==========================================================
// HisabDesk — AI Layer Barrel Exports
// ----------------------------------------------------------
// PURPOSE
//   Single import entrypoint for ALL AI infrastructure
//
//   Instead of:
//
//     import { runAI } from "@/lib/ai/openai"
//     import { guardAI } from "@/lib/ai/guard"
//     import { safeRunAI } from "@/lib/ai/safeRun"
//
//   Use:
//
//     import { safeRunAI } from "@/lib/ai"
//
//   Benefits:
//     ✓ clean imports
//     ✓ prevents wrong direct OpenAI usage
//     ✓ enforces safeRunAI pattern
//     ✓ enterprise maintainability
//
// RULE:
//   Routes should primarily use safeRunAI()
// ==========================================================

// ----------------------------------------------------------
// Core runner (ONLY one routes should use)
// ----------------------------------------------------------

export * from "./safeRun"

// ----------------------------------------------------------
// Lower level utilities (rarely needed directly)
// ----------------------------------------------------------

export * from "./guard"
export * from "./openai"
export * from "./prompts"

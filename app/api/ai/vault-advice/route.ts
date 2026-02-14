// ==========================================================
// HisabDesk — AI Vault / Document Advice Route
// ----------------------------------------------------------
// PURPOSE
//   AI insights for Vault (documents) page
//
//   Helps user:
//     • missing tax proofs
//     • unlinked receipts
//     • poor organization
//
// FLOW
//   DB → documents → documentAdvisor → compact prompt → AI
//
// RULES
//   ✓ server-side only
//   ✓ cheap model (module → GPT-3.5)
//   ✓ short bullets only
//   ✓ token efficient
//   ✓ logs usage
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

import { listDocuments } from "@/lib/api/documents"
import { analyzeDocuments } from "@/lib/modules/personal"
import { runAI } from "@/lib/ai/openai"

export const dynamic = "force-dynamic"

const supabase = createClient()

// ==========================================================
// AUTH
// ==========================================================

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return user
}

// ==========================================================
// POST
// ==========================================================

export async function POST() {
  try {
    const user = await getUser()

    // ------------------------------------------------------
    // Fetch documents
    // ------------------------------------------------------

    const docs = await listDocuments(user.id)

    const mapped = docs.map((d: any) => ({
      id: d.id,
      type: d.type,
      size: d.size,
      created_at: d.created_at,
      transaction_id: d.transaction_id,
    }))

    // ------------------------------------------------------
    // Analyze
    // ------------------------------------------------------

    const summary = analyzeDocuments(mapped)

    // ------------------------------------------------------
    // Prompt (compact)
    // ------------------------------------------------------

    const prompt = `
Vault Metrics:
total=${summary.totalDocuments}
linked=${summary.linkedPercent}
unlinked=${summary.unlinkedCount}
missingTaxProofs=${summary.missingTaxProofs ? 1 : 0}
score=${summary.organizationScore}

Give 4 short bullet tips to organize financial documents better.
`

    // ------------------------------------------------------
    // AI call (cheap)
    // ------------------------------------------------------

    const result = await runAI({
      prompt,
      type: "module",
    })

    // ------------------------------------------------------
    // Log usage
    // ------------------------------------------------------

    await supabase.from("ai_logs").insert({
      user_id: user.id,
      module: "vault-advice",
      tokens: result.usage?.total_tokens ?? 0,
    })

    return NextResponse.json({
      insights: result.text,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}

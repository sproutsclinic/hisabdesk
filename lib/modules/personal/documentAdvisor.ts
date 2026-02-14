// ==========================================================
// HisabDesk — Document Advisor (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Analyze uploaded financial documents metadata → usefulness
//   Helps:
//     • detect missing tax proofs
//     • find unlinked receipts
//     • suggest organization
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
//
// Used by:
//   - vault page
//   - tax preparation readiness
//   - AI document insights
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export type DocumentType =
  | "receipt"
  | "invoice"
  | "tax_proof"
  | "bank_statement"
  | "investment_proof"
  | "other"

export interface VaultDocument {
  id: string
  type: DocumentType
  size: number
  created_at: string
  transaction_id?: string | null
}

export interface DocumentAdvice {
  totalDocuments: number
  linkedPercent: number

  missingTaxProofs: boolean
  unlinkedCount: number

  organizationScore: number
  status: "good" | "warning" | "poor"
}

// ==========================================================
// HELPERS
// ==========================================================

function percent(a: number, b: number) {
  if (b === 0) return 0
  return (a / b) * 100
}

function round(n: number) {
  return Math.round(n)
}

// ==========================================================
// CORE ANALYZER
// ==========================================================

export function analyzeDocuments(
  docs: VaultDocument[]
): DocumentAdvice {
  if (!docs.length) {
    return {
      totalDocuments: 0,
      linkedPercent: 0,
      missingTaxProofs: true,
      unlinkedCount: 0,
      organizationScore: 0,
      status: "poor",
    }
  }

  const total = docs.length

  const linked = docs.filter((d) => d.transaction_id).length
  const unlinked = total - linked

  const linkedPercent = percent(linked, total)

  const taxProofs = docs.filter(
    (d) => d.type === "tax_proof"
  ).length

  const missingTaxProofs = taxProofs === 0

  // --------------------------------------------------------
  // Organization score logic
  // --------------------------------------------------------
  // score based on:
  //   linking %
  //   having tax proofs
  // --------------------------------------------------------

  let score = linkedPercent

  if (!missingTaxProofs) score += 20

  score = Math.min(100, score)

  let status: DocumentAdvice["status"] = "good"

  if (score < 40) status = "poor"
  else if (score < 70) status = "warning"

  return {
    totalDocuments: total,
    linkedPercent: round(linkedPercent),
    missingTaxProofs,
    unlinkedCount: unlinked,
    organizationScore: round(score),
    status,
  }
}

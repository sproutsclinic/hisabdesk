ï»¿/**
 * =========================================================
 * Auto Reconciliation Engine
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase B (AI Features)
 * =========================================================
 *
 * PURPOSE
 * Automatically match:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ bank transactions
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ expenses
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ invoices
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ payments
 *
 * So users don't manually reconcile books.
 *
 * FEATURES
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ amount match
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ fuzzy description match
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ date tolerance
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ confidence score
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ bulk reconciliation
 *
 * DESIGN
 * Fast local heuristic engine (no AI cost)
 * Later ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ GPT matching optional
 *
 * SAFE
 * - pure utility
 * - no DB writes
 * - no existing files changed
 *
 * USAGE
 *
 * const result = reconcileTransactions(bankTxns, expenses)
 *
 * =========================================================
 */

"use server"

/* =========================================================
   TYPES
========================================================= */

export type BankTxn = {
  id: string
  amount: number
  date: string
  description?: string | null
}

export type LedgerEntry = {
  id: string
  amount: number
  date: string
  description?: string | null
}

export type ReconciliationMatch = {
  bankId: string
  ledgerId: string
  confidence: number
}

export type ReconciliationResult = {
  matched: ReconciliationMatch[]
  unmatchedBank: BankTxn[]
  unmatchedLedger: LedgerEntry[]
}

/* =========================================================
   HELPERS
========================================================= */

function normalize(text?: string | null) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
}

function daysDiff(a: string, b: string) {
  const d1 = new Date(a).getTime()
  const d2 = new Date(b).getTime()
  return Math.abs(d1 - d2) / (1000 * 60 * 60 * 24)
}

/* =========================================================
   SIMPLE FUZZY MATCH
========================================================= */

function textSimilarity(a: string, b: string) {
  if (!a || !b) return 0

  const wordsA = new Set(a.split(" "))
  const wordsB = new Set(b.split(" "))

  let common = 0

  for (const w of wordsA) {
    if (wordsB.has(w)) common++
  }

  return common / Math.max(wordsA.size, wordsB.size)
}

/* =========================================================
   CONFIDENCE SCORING
========================================================= */

function scoreMatch(bank: BankTxn, ledger: LedgerEntry) {
  let score = 0

  /* Amount exact match (strongest) */
  if (Math.abs(bank.amount - ledger.amount) < 1) {
    score += 0.6
  }

  /* Date proximity (ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±3 days) */
  const diff = daysDiff(bank.date, ledger.date)
  if (diff <= 1) score += 0.25
  else if (diff <= 3) score += 0.15

  /* Description similarity */
  const sim = textSimilarity(
    normalize(bank.description),
    normalize(ledger.description)
  )

  score += sim * 0.15

  return Math.min(score, 1)
}

/* =========================================================
   MAIN ENGINE
========================================================= */

export function reconcileTransactions(
  bankTxns: BankTxn[],
  ledgerEntries: LedgerEntry[],
  threshold = 0.7
): ReconciliationResult {
  const matches: ReconciliationMatch[] = []

  const usedLedger = new Set<string>()
  const usedBank = new Set<string>()

  for (const bank of bankTxns) {
    let best: {
      ledger: LedgerEntry
      score: number
    } | null = null

    for (const ledger of ledgerEntries) {
      if (usedLedger.has(ledger.id)) continue

      const score = scoreMatch(bank, ledger)

      if (!best || score > best.score) {
        best = { ledger, score }
      }
    }

    if (best && best.score >= threshold) {
      matches.push({
        bankId: bank.id,
        ledgerId: best.ledger.id,
        confidence: Number(best.score.toFixed(2)),
      })

      usedLedger.add(best.ledger.id)
      usedBank.add(bank.id)
    }
  }

  return {
    matched: matches,
    unmatchedBank: bankTxns.filter((b) => !usedBank.has(b.id)),
    unmatchedLedger: ledgerEntries.filter(
      (l) => !usedLedger.has(l.id)
    ),
  }
}

/* =========================================================
   BULK SUMMARY HELPER
========================================================= */

export function reconciliationStats(result: ReconciliationResult) {
  const total =
    result.matched.length +
    result.unmatchedBank.length +
    result.unmatchedLedger.length

  return {
    matched: result.matched.length,
    unmatched:
      result.unmatchedBank.length +
      result.unmatchedLedger.length,
    matchRate:
      total === 0
        ? 0
        : Number((result.matched.length / total).toFixed(2)),
  }
}

/* =========================================================
   FUTURE (AI ENHANCEMENT PLACEHOLDER)
========================================================= */
/*
export async function reconcileWithAI(...) {
  // GPT-based semantic matching later
}
*/

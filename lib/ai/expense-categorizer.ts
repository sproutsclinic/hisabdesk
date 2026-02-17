ï»¿/**
 * =========================================================
 * AI Smart Expense Categorizer
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase B (AI Features)
 * =========================================================
 *
 * PURPOSE
 * Auto-classify expenses using:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ rule engine (fast)
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ keyword ML-lite mapping
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ optional AI fallback (OpenAI later)
 *
 * WHY
 * 90% categorization should be instant (no API cost)
 * AI only for unknown descriptions
 *
 * SAFE
 * - pure utility
 * - server compatible
 * - no existing file changes
 *
 * USAGE
 *
 * const category = categorizeExpense({
 *   description: "Uber ride to client office",
 *   amount: 450
 * })
 *
 * =========================================================
 */

"use server"

/* =========================================================
   TYPES
========================================================= */

export type ExpenseInput = {
  description?: string | null
  vendor?: string | null
  amount?: number
}

export type ExpenseCategory =
  | "Travel"
  | "Food"
  | "Office"
  | "Software"
  | "Marketing"
  | "Utilities"
  | "Professional"
  | "Rent"
  | "Salary"
  | "Tax"
  | "Medical"
  | "Misc"

/* =========================================================
   KEYWORD ENGINE (FAST + FREE)
========================================================= */

const CATEGORY_KEYWORDS: Record<ExpenseCategory, string[]> = {
  Travel: [
    "uber",
    "ola",
    "rapido",
    "flight",
    "train",
    "irctc",
    "hotel",
    "travel",
    "taxi",
    "bus",
  ],

  Food: [
    "zomato",
    "swiggy",
    "restaurant",
    "cafe",
    "food",
    "lunch",
    "dinner",
    "snacks",
  ],

  Office: [
    "stationery",
    "printer",
    "paper",
    "chair",
    "desk",
    "furniture",
    "amazon office",
  ],

  Software: [
    "openai",
    "chatgpt",
    "vercel",
    "aws",
    "google cloud",
    "supabase",
    "notion",
    "figma",
    "canva",
    "zoho",
    "software",
    "subscription",
    "saas",
  ],

  Marketing: [
    "facebook ads",
    "google ads",
    "meta ads",
    "instagram ads",
    "ads",
    "marketing",
    "promotion",
    "banner",
  ],

  Utilities: [
    "electricity",
    "water",
    "internet",
    "wifi",
    "broadband",
    "mobile bill",
    "gas",
  ],

  Professional: [
    "consultant",
    "lawyer",
    "legal",
    "ca",
    "accountant",
    "freelancer",
    "service fee",
  ],

  Rent: ["rent", "lease", "coworking", "office rent"],

  Salary: ["salary", "payroll", "stipend", "bonus"],

  Tax: ["gst", "tds", "tax", "income tax", "advance tax"],

  Medical: ["hospital", "clinic", "pharmacy", "medicine", "medical"],

  Misc: [],
}

/* =========================================================
   INTERNAL: CLEAN TEXT
========================================================= */

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, "")
}

/* =========================================================
   RULE ENGINE
========================================================= */

function ruleBasedCategory(text: string): ExpenseCategory | null {
  for (const [category, keywords] of Object.entries(
    CATEGORY_KEYWORDS
  )) {
    for (const word of keywords) {
      if (text.includes(word)) {
        return category as ExpenseCategory
      }
    }
  }

  return null
}

/* =========================================================
   MAIN FUNCTION
========================================================= */

export function categorizeExpense(
  input: ExpenseInput
): ExpenseCategory {
  const combined = normalize(
    `${input.description || ""} ${input.vendor || ""}`
  )

  /* 1ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£ Rule-based fast detection */
  const rule = ruleBasedCategory(combined)
  if (rule) return rule

  /* 2ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£ Amount heuristics */
  if ((input.amount || 0) > 50000) return "Professional"

  /* 3ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£ Default fallback */
  return "Misc"
}

/* =========================================================
   BULK HELPER (for batch import)
========================================================= */

export function categorizeExpensesBulk(
  rows: ExpenseInput[]
) {
  return rows.map((r) => ({
    ...r,
    category: categorizeExpense(r),
  }))
}

/* =========================================================
   FUTURE READY (AI fallback placeholder)
========================================================= */
/*
export async function categorizeWithAI(text: string) {
  // Later plug OpenAI here for ambiguous cases
}
*/

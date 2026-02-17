ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Expense Categoriser (Deterministic Engine)
   -------------------------------------------------------
   PURPOSE
   Rule-based fallback categorisation.
   NO AI calls here.
   Used before / instead of AI for safety + speed.
========================================================= */

export type ExpenseInput = {
  description?: string | null
  merchant?: string | null
  notes?: string | null
  amount?: number | null
}

export type ExpenseCategory =
  | "food"
  | "travel"
  | "utilities"
  | "shopping"
  | "health"
  | "education"
  | "subscriptions"
  | "rent"
  | "salary"
  | "uncategorised"

/* =========================================================
   KEYWORD MAP
========================================================= */

const RULES: Record<ExpenseCategory, string[]> = {
  food: ["zomato", "swiggy", "restaurant", "cafe", "food"],
  travel: ["uber", "ola", "flight", "train", "taxi", "hotel"],
  utilities: ["electric", "wifi", "internet", "bill", "gas"],
  shopping: ["amazon", "flipkart", "store", "mall"],
  health: ["pharmacy", "doctor", "hospital", "medicine"],
  education: ["course", "udemy", "book", "training"],
  subscriptions: ["netflix", "spotify", "subscription", "saas"],
  rent: ["rent", "lease"],
  salary: ["salary", "payroll"],
  uncategorised: [],
}

/* =========================================================
   ENGINE
========================================================= */

export function categorizeExpense(input: ExpenseInput): ExpenseCategory {
  const text = `${input.description ?? ""} ${input.merchant ?? ""} ${input.notes ?? ""}`
    .toLowerCase()

  for (const [category, keywords] of Object.entries(RULES)) {
    if (keywords.some((k) => text.includes(k))) {
      return category as ExpenseCategory
    }
  }

  return "uncategorised"
}

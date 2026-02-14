// ==========================================================
// HisabDesk — Global Categorizer Engine
// Shared by Income + Expense + Bank + OCR
// Deterministic • Offline • Self-learning
// ==========================================================

const STORAGE_KEY = "hisabdesk_category_memory"

type MemoryMap = Record<string, string>

/* ==========================================================
   LOAD MEMORY
========================================================== */

function load(): MemoryMap {
  if (typeof window === "undefined") return {}

  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : {}
}

/* ==========================================================
   SAVE MEMORY
========================================================== */

function save(map: MemoryMap) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

/* ==========================================================
   LEARN
========================================================== */

export function learnCategory(text: string, category: string) {
  const memory = load()

  const key = text.toLowerCase().split(" ")[0]

  memory[key] = category

  save(memory)
}

/* ==========================================================
   DETECT (GLOBAL)
========================================================== */

export function detectCategory(
  text: string,
  type: "income" | "expense"
) {
  const t = text.toLowerCase()
  const memory = load()

  /* -------------------------
     learned first
  ------------------------- */

  for (const key of Object.keys(memory)) {
    if (t.includes(key)) return memory[key]
  }

  /* -------------------------
     expense rules
  ------------------------- */

  if (type === "expense") {
    if (/swiggy|zomato|restaurant|food/.test(t)) return "Food"
    if (/uber|ola|travel|metro|bus/.test(t)) return "Travel"
    if (/petrol|diesel|fuel/.test(t)) return "Fuel"
    if (/amazon|shopping|store/.test(t)) return "Shopping"
    if (/rent|lease/.test(t)) return "Rent"
    if (/emi|loan/.test(t)) return "Loan/EMI"
    if (/electricity|water|gas|bill/.test(t)) return "Utilities"
    if (/hospital|medical|pharmacy/.test(t)) return "Medical"

    return "Misc"
  }

  /* -------------------------
     income rules
  ------------------------- */

  if (type === "income") {
    if (/salary|payroll/.test(t)) return "Salary"
    if (/upwork|fiverr|freelance/.test(t)) return "Freelance"
    if (/stripe|razorpay/.test(t)) return "Business"
    if (/interest|fd/.test(t)) return "Interest"
    if (/refund/.test(t)) return "Refund"

    return "Other"
  }

  return "Other"
}

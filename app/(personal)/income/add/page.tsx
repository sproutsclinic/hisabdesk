ï»¿"use client"

/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Add Income (PERSONAL ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ PRO ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ AI ENABLED)
   ---------------------------------------------------------
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Manual entry
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ OCR camera
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ PDF import
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Professional categories
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ AI insights panel
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ API only (no DB calls)
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â no business logic
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Next.js 16 STRICT MODE SAFE
========================================================= */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [aiText, setAiText] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  /* ========================================================
     CATEGORY MAP
  ======================================================== */

  const CATEGORY_MAP: Record<string, string[]> = {
    Salary: ["Monthly Salary", "Bonus", "Incentive"],

    Professional: [
      "Consultation Fee",
      "Professional Fee",
      "Client Payment",
      "Service Charges",
    ],

    Freelance: ["Project", "Part-time", "Contract Work"],
    Business: ["Sales Revenue", "Customer Payment"],

    Investment: ["Interest", "Dividend", "Capital Gain"],
    Trading: ["Stocks", "Crypto", "F&O", "Intraday"],
    Rental: ["Property Rent", "Room Rent"],

    Lending: ["Interest from Friends", "Loan Return"],
    Gifts: ["Family Gift", "Cash Gift", "Transfer Received"],
    Refunds: ["Cashback", "Refund", "Reversal"],

    Other: ["Misc"],
  }

  const PAYMENT_OPTIONS = [
    "Bank Transfer",
    "UPI",
    "Cash",
    "Cheque",
    "Wallet",
  ]

  const [category, setCategory] = useState("Salary")
  const [subcategory, setSubcategory] = useState("Monthly Salary")
  const [payment, setPayment] = useState("Bank Transfer")

  /* ========================================================
     CATEGORY CHANGE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â STRICT SAFE
  ======================================================== */

  function handleCategoryChange(value: string) {
    setCategory(value)

    const subs = CATEGORY_MAP[value] ?? []
    const first = subs.at(0)

    setSubcategory(first ?? "")
  }

  /* ========================================================
     AI LOAD
  ======================================================== */

  useEffect(() => {
    async function loadAI() {
      try {
        setAiLoading(true)

        const res = await fetch("/api/ai/income-summary", {
          method: "POST",
        })

        const json = await res.json()
        setAiText(json?.insights ?? null)
      } catch {
        setAiText(null)
      } finally {
        setAiLoading(false)
      }
    }

    loadAI()
  }, [])

  /* ========================================================
     SAVE (API ONLY)
  ======================================================== */

  async function createIncome(data: unknown) {
    await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)

    const date = String(formData.get("date"))
    const amount = Number(formData.get("amount"))
    const description = String(formData.get("description"))

    await createIncome({
      date,
      amount,
      category: `${category} / ${subcategory}`,
      notes: `${description} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ ${payment}`,
    })

    router.push("/personal/income")
  }

  /* ========================================================
     OCR IMPORT
  ======================================================== */

  async function handlePhoto(file: File) {
    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/income/ocr", {
      method: "POST",
      body: form,
    })

    const { text } = await res.json()

    const amountMatch = text.match(/[\d,]+\.\d{2}/)
    const amount = amountMatch
      ? Number(amountMatch[0].replace(/,/g, ""))
      : 0

    await createIncome({
      date: new Date().toISOString().slice(0, 10),
      amount,
      category: "Auto Detected",
      notes: text.slice(0, 120),
    })

    router.push("/personal/income")
  }

  /* ========================================================
     PDF IMPORT
  ======================================================== */

  async function handlePDF(file: File) {
    const form = new FormData()
    form.append("file", file)

    await fetch("/api/income/pdf-to-text", {
      method: "POST",
      body: form,
    })

    router.push("/personal/income")
  }

  /* ========================================================
     UI
  ======================================================== */

  return (
    <main className="max-w-md mx-auto px-4 py-6 space-y-5">
      <h1 className="text-xl font-semibold">Add Income</h1>

      <div className="p-4 bg-blue-50 border rounded-xl text-sm">
        {aiLoading && "Analyzing income trends..."}
        {!aiLoading && aiText && (
          <pre className="whitespace-pre-wrap">{aiText}</pre>
        )}
      </div>

      <form action={handleSubmit} className="space-y-3">
        <input
          type="date"
          name="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="number"
          name="amount"
          placeholder="ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ Amount"
          required
          className="w-full border rounded-lg p-3 text-lg font-medium text-green-600"
        />

        <input
          type="text"
          name="description"
          placeholder="Source / Client / Person"
          required
          className="w-full border rounded-lg p-3"
        />

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {Object.keys(CATEGORY_MAP).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {(CATEGORY_MAP[category] ?? []).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {PAYMENT_OPTIONS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded-lg p-3"
        >
          {loading ? "Saving..." : "Save Income"}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-3">
        <label className="p-4 border rounded-xl text-center cursor-pointer">
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ Scan Slip
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              handlePhoto(file)
            }}
          />
        </label>

        <label className="p-4 border rounded-xl text-center cursor-pointer">
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ Upload PDF
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              handlePDF(file)
            }}
          />
        </label>
      </div>
    </main>
  )
}

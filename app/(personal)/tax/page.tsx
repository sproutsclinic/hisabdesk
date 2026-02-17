ï»¿"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

/* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ AI Hook (ONLY for advice now) */
import { useTaxAI } from "@/hooks/useTax"

import TaxAIAdviceCard from "./components/TaxAIAdviceCard"
import TaxExportButton from "./components/TaxExportButton"
import TaxPDFButton from "./components/TaxPDFButton"
import TaxShareEmailButton from "./components/TaxShareEmailButton"
import TaxSummaryCard from "./components/TaxSummaryCard"
import TaxHistoryTable from "./components/TaxHistoryTable"
import TaxComparisonChart from "./components/TaxComparisonChart"
import TaxDeductionTooltip from "./components/TaxDeductionTooltips"

import type { TaxComputationResult } from "@/lib/api/tax/types"

/* ========================================================= */

type NumMap = Record<string, number>

const emptyIncome: NumMap = {
  salary: 0,
  business: 0,
  capitalGains: 0,
  other: 0,
}

const emptyDeduction: NumMap = {
  section80C: 0,
  section80D: 0,
  section80CCD: 0,
  hra: 0,
  homeLoanInterest: 0,
  other: 0,
}

/* ========================================================= */

export default function TaxPage() {
  /* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ AI ONLY */
  const { getAdvice, message, loading: aiLoading, reset } = useTaxAI("2024-25")

  /* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Deterministic computation state */
  const [result, setResult] = useState<TaxComputationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [age, setAge] = useState(30)
  const [filingStatus, setFilingStatus] = useState("individual")

  const [income, setIncome] = useState<NumMap>(emptyIncome)
  const [deductions, setDeductions] = useState<NumMap>(emptyDeduction)

  const handleIncome = (key: string, value: number) =>
    setIncome((s) => ({ ...s, [key]: value }))

  const handleDeduction = (key: string, value: number) =>
    setDeductions((s) => ({ ...s, [key]: value }))

  /* =========================================================
     TAX CALCULATION (API ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â NOT AI)
  ========================================================= */

  const runCalculation = async () => {
    try {
      setLoading(true)
      setError(null)
      reset()

      const res = await fetch("/api/tax/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          filingStatus,
          income,
          deductions,
        }),
      })

      if (!res.ok) throw new Error("Failed to compute tax")

      const json: TaxComputationResult = await res.json()
      setResult(json)

      /* Ask AI AFTER calculation */
      await getAdvice()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  /* ========================================================= */

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Tax Planner</h1>
        <p className="text-sm text-muted-foreground">
          Old vs New regime comparison with AI insights
        </p>
      </div>

      {/* PROFILE */}
      <Card className="p-6 space-y-6">
        <h2 className="font-medium">Profile</h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="border rounded p-2"
          />

          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
            className="border rounded p-2"
          >
            <option value="individual">Individual</option>
            <option value="business">Business</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>
      </Card>

      {/* INCOME */}
      <Card className="p-6 space-y-4">
        <h2 className="font-medium">Income</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(income).map((k) => (
            <input
              key={k}
              type="number"
              placeholder={k}
              value={income[k]}
              onChange={(e) => handleIncome(k, Number(e.target.value))}
              className="border rounded p-2"
            />
          ))}
        </div>
      </Card>

      {/* DEDUCTIONS */}
      <Card className="p-6 space-y-4">
        <h2 className="font-medium">Deductions (Old Regime)</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(deductions).map((k) => (
            <div key={k} className="flex items-center">
              <input
                type="number"
                value={deductions[k]}
                onChange={(e) => handleDeduction(k, Number(e.target.value))}
                className="border rounded p-2 w-full"
              />

              <TaxDeductionTooltip code={k.toUpperCase()} />
            </div>
          ))}
        </div>
      </Card>

      <button
        onClick={runCalculation}
        disabled={loading}
        className="px-6 py-2 rounded bg-black text-white"
      >
        {loading ? "Calculating..." : "Calculate Tax"}
      </button>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {result && (
        <>
          <TaxSummaryCard result={result} />
          <TaxComparisonChart result={result} />

          <div className="mt-3 flex gap-3 flex-wrap">
            <TaxExportButton financialYear="2024-25" />
            <TaxPDFButton financialYear="2024-25" />
            <TaxShareEmailButton result={result} financialYear="2024-25" />
          </div>

         <TaxAIAdviceCard financialYear="2024-25" />
        </>
      )}
    </div>
  )
}

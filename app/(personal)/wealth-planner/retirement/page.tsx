ï»¿"use client"

/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Retirement Calculator
   ---------------------------------------------------------
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ compound growth
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ inflation adjusted corpus
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ simple inputs
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ AI advice
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ mobile first
========================================================= */

import { useState, useMemo, useEffect } from "react"

/* ========================================================= */

export default function RetirementPage() {
  /* ========================================================
     INPUTS
  ======================================================== */

  const [age, setAge] = useState(30)
  const [retireAge, setRetireAge] = useState(60)
  const [sip, setSip] = useState(25000)
  const [returnRate, setReturnRate] = useState(12)
  const [inflation, setInflation] = useState(6)

  /* ========================================================
     AI
  ======================================================== */

  const [aiText, setAiText] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  /* ========================================================
     CALCULATIONS
  ======================================================== */

  const result = useMemo(() => {
    const years = retireAge - age
    const months = years * 12

    const r = returnRate / 100 / 12

    // SIP future value formula
    const fv =
      sip *
      (((1 + r) ** months - 1) / r) *
      (1 + r)

    // inflation adjusted corpus
    const realValue =
      fv / (1 + inflation / 100) ** years

    return {
      years,
      corpus: Math.round(fv),
      realCorpus: Math.round(realValue),
    }
  }, [age, retireAge, sip, returnRate, inflation])

  /* ========================================================
     AI CALL
  ======================================================== */

  async function loadAI() {
    setAiLoading(true)

    const res = await fetch("/api/ai/retirement-advice", {
      method: "POST",
      body: JSON.stringify(result),
    })

    const json = await res.json()

    setAiText(json.insights)
    setAiLoading(false)
  }

  useEffect(() => {
    loadAI()
  }, [result])

  /* ========================================================
     UI
  ======================================================== */

  return (
    <main className="max-w-xl mx-auto px-4 py-6 space-y-6">

      <h1 className="text-2xl font-semibold">
        Retirement Planner
      </h1>

      {/* ================= INPUTS ================= */}

      <div className="space-y-3">

        <Input label="Current Age" value={age} set={setAge} />
        <Input label="Retirement Age" value={retireAge} set={setRetireAge} />
        <Input label="Monthly SIP (ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹)" value={sip} set={setSip} />
        <Input label="Expected Return %" value={returnRate} set={setReturnRate} />
        <Input label="Inflation %" value={inflation} set={setInflation} />

      </div>

      {/* ================= RESULTS ================= */}

      <div className="p-4 bg-green-50 border rounded-xl space-y-2">

        <p className="text-sm text-muted-foreground">
          Years to retirement
        </p>
        <p className="font-semibold">{result.years} years</p>

        <p className="text-sm text-muted-foreground">
          Future corpus
        </p>
        <p className="font-semibold text-green-700">
          ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {result.corpus.toLocaleString("en-IN")}
        </p>

        <p className="text-xs text-gray-500">
          Inflation adjusted: ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {result.realCorpus.toLocaleString("en-IN")}
        </p>

      </div>

      {/* ================= AI ================= */}

      <div className="p-4 bg-blue-50 border rounded-xl text-sm whitespace-pre-wrap">
        {aiLoading && "Analyzing retirement readiness..."}
        {!aiLoading && aiText}
      </div>

    </main>
  )
}

/* =========================================================
   Input
========================================================= */

function Input({ label, value, set }: any) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-500">{label}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full border rounded-lg p-2"
      />
    </div>
  )
}

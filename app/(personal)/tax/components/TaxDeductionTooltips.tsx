/* =========================================================
   HisabDesk — TaxDeductionTooltips
   ---------------------------------------------------------
   UI ONLY HELPER COMPONENT

   PURPOSE
   - Shows inline helper info for deduction inputs
   - Educates users about limits
   - Reduces mistakes
   - ZERO logic
   - ZERO calculations
   - ZERO DB
   - ZERO AI

   USAGE
     <TaxDeductionTooltip code="80C" />

   RULES
   ✅ Presentational only
   ✅ Static content only
   ✅ No hooks
   ✅ No side effects

   ========================================================= */

"use client"

import { Info } from "lucide-react"

/* =========================================================
   CONTENT MAP (static knowledge only)
   ========================================================= */

const MAP: Record<
  string,
  {
    title: string
    description: string
  }
> = {
  "80C": {
    title: "Section 80C",
    description:
      "PF, PPF, ELSS, LIC, tuition fees. Maximum deduction ₹ 1,50,000.",
  },
  "80D": {
    title: "Section 80D",
    description:
      "Health insurance premium. Standard limit ₹ 25,000 (higher for senior citizens).",
  },
  "80CCD": {
    title: "Section 80CCD(1B)",
    description:
      "NPS additional contribution. Extra deduction up to ₹ 50,000.",
  },
  HRA: {
    title: "HRA",
    description:
      "House Rent Allowance exemption based on salary, rent and city rules.",
  },
  HOME_LOAN: {
    title: "Home Loan Interest",
    description:
      "Interest paid on housing loan. Commonly deductible up to ₹ 2,00,000.",
  },
  OTHER: {
    title: "Other",
    description:
      "Any additional eligible deductions not covered above.",
  },
}

/* =========================================================
   COMPONENT
   ========================================================= */

interface Props {
  code: keyof typeof MAP
}

export default function TaxDeductionTooltip({ code }: Props) {
  const item = MAP[code]

  if (!item) return null

  return (
    <span className="relative group inline-flex items-center ml-1">
      {/* icon */}
      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />

      {/* tooltip */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2 top-6
          hidden group-hover:block
          w-64 z-50
          rounded-xl border bg-background shadow-lg
          p-3 text-xs
        "
      >
        <div className="font-medium mb-1">{item.title}</div>
        <div className="text-muted-foreground">{item.description}</div>
      </div>
    </span>
  )
}

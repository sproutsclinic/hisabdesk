import jsPDF from "jspdf"
import { supabase } from "@/lib/supabase"
import { isProUser } from "@/lib/isPro"

/* =================================================
   🔒 PDF REPORT — PRO ONLY
   Free → redirect billing
   Pro → generate PDF
================================================= */

export async function generateTaxPDF(data: {
  income: number
  expense: number
  deductions: number
  profit: number
  oldTax: number
  newTax: number
  adaTax: number
  best: string
}) {
  /* ================= PRO LOCK ================= */

  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user

  if (!user) {
    window.location.href = "/login"
    return
  }

  const pro = await isProUser(user.id)

  if (!pro) {
    window.location.href = "/billing"
    return
  }

  /* ================= PDF ================= */

  const doc = new jsPDF()

  let y = 20

  const line = (text: string) => {
    doc.text(text, 20, y)
    y += 10
  }

  doc.setFontSize(18)
  line("HisabDesk Tax Report")

  doc.setFontSize(12)
  y += 10

  line(`Total Income: ₹ ${data.income}`)
  line(`Total Expense: ₹ ${data.expense}`)
  line(`Deductions: ₹ ${data.deductions}`)
  line(`Net Profit: ₹ ${data.profit}`)

  line("----------------------------")

  line(`Old Regime Tax: ₹ ${data.oldTax}`)
  line(`New Regime Tax: ₹ ${data.newTax}`)
  line(`44ADA Tax: ₹ ${data.adaTax}`)

  line("----------------------------")

  line(`Best Choice: ${data.best}`)

  doc.save("hisabdesk-tax-report.pdf")
}

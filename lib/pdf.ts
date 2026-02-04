import jsPDF from "jspdf"

export function generateTaxPDF(data: {
  income: number
  expense: number
   deductions: number
  profit: number
  oldTax: number
  newTax: number
  adaTax: number
  best: string
}) {
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
  line(`Net Profit: ₹ ${data.profit}`)
  line("----------------------------")

  line(`Old Regime Tax: ₹ ${data.oldTax}`)
  line(`New Regime Tax: ₹ ${data.newTax}`)
  line(`44ADA Tax: ₹ ${data.adaTax}`)

  line("----------------------------")
  line(`Best Choice: ${data.best}`)

  doc.save("hisabdesk-tax-report.pdf")
}

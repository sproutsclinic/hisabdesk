// ==========================================================
// HisabDesk — Filing Page (Enterprise Placeholder)
// Clean • Private • No marketing
// Route: /app/filing
// ==========================================================

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { FileText, Upload, CheckCircle2 } from "lucide-react"

export default function FilingPage() {
  return (
    <main className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold">Tax Filing</h1>
        <p className="text-sm text-zinc-500">
          Prepare and submit your returns safely
        </p>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4">

        <Card className="p-5 space-y-3">
          <Upload size={18} />
          <p className="text-sm font-medium">Upload Documents</p>
          <p className="text-xs text-zinc-500">
            Bank statements, Form 16, invoices
          </p>
          <Link href="/app/vault" className="btn-outline text-center">
            Open Vault
          </Link>
        </Card>

        <Card className="p-5 space-y-3">
          <FileText size={18} />
          <p className="text-sm font-medium">Generate Reports</p>
          <p className="text-xs text-zinc-500">
            Income, expense and tax summaries
          </p>
          <Link href="/app/insights" className="btn-outline text-center">
            View Reports
          </Link>
        </Card>

        <Card className="p-5 space-y-3">
          <CheckCircle2 size={18} />
          <p className="text-sm font-medium">Ready to File</p>
          <p className="text-xs text-zinc-500">
            Submit return once verified
          </p>
          <button className="btn w-full" disabled>
            Filing (Coming Soon)
          </button>
        </Card>

      </div>

      {/* Info */}
      <Card className="p-5 bg-zinc-50 border border-zinc-200">
        <p className="text-xs text-zinc-500">
          Filing tools will automatically compute taxable income, compare
          regimes and generate ready-to-submit summaries.
        </p>
      </Card>

    </main>
  )
}

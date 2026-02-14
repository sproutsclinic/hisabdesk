"use client"

import GSTOverviewCards from "./components/gst-overview-cards"
import GSTActionsBar from "./components/gst-actions-bar"
import GSTInvoicesTable from "./components/gst-invoices-table"
import ConnectGST from "./components/connect-gst"

type Props = {
  orgId: string
  invoices: any[]
  summary: any
}

/*
=========================================================
GST CLIENT — ENTERPRISE UI
✓ centered layout
✓ white canvas
✓ sections
✓ mobile friendly
✓ fintech polish
=========================================================
*/

export default function GSTClient({
  orgId,
  invoices,
  summary,
}: Props) {
  return (
    <main className="min-h-screen bg-white">
      <div className="container-app py-8 space-y-8">

        {/* ================= HEADER ================= */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            GST Dashboard
          </h1>
        </header>

        {/* ================= CONNECT ================= */}
        <section className="card">
          <p className="text-xs text-gray-500 mb-3">
            GST Portal Connection
          </p>

          <ConnectGST orgId={orgId} />
        </section>

        {/* ================= ACTIONS ================= */}
        <section>
          <GSTActionsBar />
        </section>

        {/* ================= OVERVIEW ================= */}
        <section>
          <GSTOverviewCards summary={summary} />
        </section>

        {/* ================= TABLE ================= */}
        <section className="card p-0 overflow-hidden">
          <GSTInvoicesTable invoices={invoices} />
        </section>

      </div>
    </main>
  )
}

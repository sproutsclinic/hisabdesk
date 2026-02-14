"use client"

import { useMemo, useState } from "react"

interface Invoice {
  id: string
  invoice_no: string
  invoice_date: string
  party_name?: string
  gstin?: string
  type: "sales" | "purchase"
  total?: number
  gst_total?: number
  reconciliation_status?: string
  gst_category?: string
}

interface Props {
  invoices: Invoice[]
}

/*
=========================================================
GST INVOICES TABLE
Enterprise grid
Large dataset friendly
Client-side search + filter
No external libraries
Production safe

Used in:
app/gst/page.tsx

Features:
✓ Search
✓ Type filter
✓ Status filter
✓ Sticky header
✓ Responsive
=========================================================
*/

export default function GSTInvoicesTable({ invoices }: Props) {
  const [query, setQuery] = useState("")
  const [type, setType] = useState("all")
  const [status, setStatus] = useState("all")

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        !query ||
        inv.invoice_no?.toLowerCase().includes(query.toLowerCase()) ||
        inv.party_name?.toLowerCase().includes(query.toLowerCase()) ||
        inv.gstin?.toLowerCase().includes(query.toLowerCase())

      const matchType = type === "all" || inv.type === type
      const matchStatus =
        status === "all" || inv.reconciliation_status === status

      return matchSearch && matchType && matchStatus
    })
  }, [invoices, query, type, status])

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b p-4">
        <input
          placeholder="Search invoice / party / GSTIN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 rounded-lg border px-3 py-2 text-sm"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Types</option>
          <option value="sales">Sales</option>
          <option value="purchase">Purchase</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="matched">Matched</option>
          <option value="partial">Partial</option>
          <option value="mismatch">Mismatch</option>
          <option value="missing">Missing</option>
          <option value="duplicate">Duplicate</option>
        </select>

        <div className="ml-auto text-sm text-gray-500">
          {filtered.length} records
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[600px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 text-gray-600">
            <tr>
              <Th>Invoice</Th>
              <Th>Date</Th>
              <Th>Party</Th>
              <Th>GSTIN</Th>
              <Th>Type</Th>
              <Th align="right">Total</Th>
              <Th align="right">GST</Th>
              <Th>Status</Th>
              <Th>Category</Th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((inv) => (
              <tr
                key={inv.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <Td className="font-medium">{inv.invoice_no}</Td>
                <Td>{formatDate(inv.invoice_date)}</Td>
                <Td>{inv.party_name || "-"}</Td>
                <Td>{inv.gstin || "-"}</Td>
                <Td>
                  <TypeBadge type={inv.type} />
                </Td>
                <Td align="right">{formatMoney(inv.total)}</Td>
                <Td align="right">{formatMoney(inv.gst_total)}</Td>
                <Td>
                  <StatusBadge status={inv.reconciliation_status} />
                </Td>
                <Td>{inv.gst_category || "-"}</Td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="py-10 text-center text-gray-400"
                >
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ====================================================== */

function Th({
  children,
  align,
}: {
  children: React.ReactNode
  align?: "right" | "left"
}) {
  return (
    <th
      className={`px-4 py-3 font-semibold ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  align,
  className,
}: {
  children: React.ReactNode
  align?: "right" | "left"
  className?: string
}) {
  return (
    <td
      className={`px-4 py-3 ${
        align === "right" ? "text-right" : "text-left"
      } ${className || ""}`}
    >
      {children}
    </td>
  )
}

function TypeBadge({ type }: { type: string }) {
  const style =
    type === "sales"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700"

  return (
    <span className={`rounded-full px-2 py-1 text-xs ${style}`}>
      {type}
    </span>
  )
}

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    matched: "bg-green-100 text-green-700",
    partial: "bg-yellow-100 text-yellow-700",
    mismatch: "bg-red-100 text-red-700",
    missing: "bg-gray-100 text-gray-700",
    duplicate: "bg-purple-100 text-purple-700",
  }

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs ${
        map[status || ""] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "-"}
    </span>
  )
}

function formatMoney(n?: number) {
  if (!n) return "0"
  return new Intl.NumberFormat("en-IN").format(n)
}

function formatDate(d: string) {
  if (!d) return "-"
  return new Date(d).toLocaleDateString("en-IN")
}

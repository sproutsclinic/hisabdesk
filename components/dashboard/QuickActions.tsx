"use client"

import Link from "next/link"

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">

      <Link href="/income/add" className="btn text-center">
        + Income
      </Link>

      <Link href="/expense/add" className="btn text-center">
        + Expense
      </Link>

      <Link href="/tax/documents" className="btn text-center">
        Upload
      </Link>

    </div>
  )
}

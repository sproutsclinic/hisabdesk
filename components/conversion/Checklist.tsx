"use client"

import Link from "next/link"

export default function Checklist({
  hasIncome,
  hasExpense,
  isPro
}: {
  hasIncome: boolean
  hasExpense: boolean
  isPro: boolean
}) {
  const items = [
    { done: hasIncome, label: "Add your first income", href: "/income/add" },
    { done: hasExpense, label: "Add your first expense", href: "/expense/add" },
    { done: isPro, label: "Unlock Pro features", href: "/billing" }
  ]

  return (
    <div className="card space-y-3">
      <h3 className="text-sm font-medium text-zinc-500">
        Setup Checklist
      </h3>

      {items.map((i) => (
        <Link
          key={i.label}
          href={i.href}
          className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-zinc-50"
        >
          <span>{i.label}</span>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              i.done
                ? "bg-green-100 text-green-700"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {i.done ? "Done" : "Pending"}
          </span>
        </Link>
      ))}
    </div>
  )
}

"use client"

import Link from "next/link"
import { CheckCircle2, Circle } from "lucide-react"

/* =================================================
   CHECKLIST — Conversion + Activation

   Upgrades:
   ✅ clearer progress
   ✅ icons instead of badges
   ✅ Stripe-like clean look
   ✅ better mobile tap targets
   ✅ zero breaking props
================================================= */

export default function Checklist({
  hasIncome,
  hasExpense,
  isPro,
}: {
  hasIncome: boolean
  hasExpense: boolean
  isPro: boolean
}) {
  const items = [
    {
      done: hasIncome,
      label: "Add your first income",
      href: "/income/add",
    },
    {
      done: hasExpense,
      label: "Add your first expense",
      href: "/expense/add",
    },
    {
      done: isPro,
      label: "Unlock Pro features",
      href: "/billing",
    },
  ]

  return (
    <div className="card space-y-3">
      <h3 className="text-sm font-medium text-zinc-500">
        Getting started
      </h3>

      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="
            flex items-center justify-between
            text-sm
            px-3 py-2.5
            rounded-xl
            hover:bg-zinc-50 dark:hover:bg-zinc-800
            transition
          "
        >
          <div className="flex items-center gap-3">
            {item.done ? (
              <CheckCircle2
                size={16}
                className="text-green-600"
              />
            ) : (
              <Circle
                size={16}
                className="text-zinc-400"
              />
            )}

            <span
              className={
                item.done
                  ? "line-through text-zinc-400"
                  : ""
              }
            >
              {item.label}
            </span>
          </div>

          <span className="text-xs text-zinc-400">
            {item.done ? "Done" : "Open"}
          </span>
        </Link>
      ))}
    </div>
  )
}

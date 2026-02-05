"use client"

import Link from "next/link"
import { PlusCircle } from "lucide-react"

/* =================================================
   EMPTY STATE — Fintech Grade

   Purpose:
   ✅ avoids blank screens
   ✅ guides first action
   ✅ improves activation rate
   ✅ clean card UI
   ✅ mobile friendly

   Usage:

   <EmptyState
     title="No transactions yet"
     description="Add income or expense to start tracking tax savings"
     actionHref="/income/add"
     actionLabel="Add Income"
   />
================================================= */

export default function EmptyState({
  title = "No data yet",
  description = "Start by adding your first transaction",
  actionHref,
  actionLabel = "Get Started",
}: {
  title?: string
  description?: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div
      className="
        w-full max-w-md mx-auto
        text-center
        py-16 px-6
        space-y-5

        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-2xl
        shadow-sm
      "
    >
      {/* ===== Icon ===== */}
      <div
        className="
          mx-auto
          w-12 h-12
          rounded-full
          bg-zinc-100 dark:bg-zinc-800
          flex items-center justify-center
        "
      >
        <PlusCircle size={20} className="text-zinc-600" />
      </div>

      {/* ===== Text ===== */}
      <div className="space-y-1">
        <h3 className="text-base font-semibold">
          {title}
        </h3>

        <p className="text-sm text-zinc-500">
          {description}
        </p>
      </div>

      {/* ===== CTA ===== */}
      {actionHref && (
        <Link
          href={actionHref}
          className="
            inline-flex items-center justify-center
            bg-zinc-900 text-white
            px-4 py-2
            rounded-xl text-sm font-medium
            hover:opacity-90
            transition
          "
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

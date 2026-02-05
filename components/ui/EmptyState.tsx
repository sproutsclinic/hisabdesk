"use client"

import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function EmptyState({
  title = "No data yet",
  description = "Start by adding your first transaction",
  actionHref,
  actionLabel = "Get Started"
}: {
  title?: string
  description?: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div className="card text-center py-14 space-y-4">

      {/* icon */}
      <div className="mx-auto w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center">
        <PlusCircle size={20} className="text-zinc-600" />
      </div>

      <h3 className="font-semibold text-base">
        {title}
      </h3>

      <p className="text-sm text-zinc-500 max-w-xs mx-auto">
        {description}
      </p>

      {actionHref && (
        <Link
          href={actionHref}
          className="btn mx-auto w-fit"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

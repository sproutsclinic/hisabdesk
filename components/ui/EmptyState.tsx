ï»¿"use client"

import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/* =================================================
   EMPTY STATE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Enterprise Fintech Grade (Hardened)

   Improvements:
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ consistent with Card + Button system
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ no dark mode (design system aligned)
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ optional secondary action
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ supports custom icon
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ tighter spacing
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ reusable everywhere (lists, vault, docs, etc.)
================================================= */

interface Props {
  title?: string
  description?: string

  actionHref?: string
  actionLabel?: string

  secondaryHref?: string
  secondaryLabel?: string

  icon?: React.ReactNode
  className?: string
}

export default function EmptyState({
  title = "No data yet",
  description = "Start by adding your first record",

  actionHref,
  actionLabel = "Get Started",

  secondaryHref,
  secondaryLabel,

  icon,
  className,
}: Props) {
  return (
    <div
      className={cn(
        `
        mx-auto
        max-w-md
        text-center
        px-6 py-14
        space-y-6

        rounded-2xl
        border border-gray-200
        bg-white
        shadow-sm
        `,
        className
      )}
    >
      {/* ================= ICON ================= */}
      <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
        {icon ?? <PlusCircle size={20} className="text-gray-600" />}
      </div>

      {/* ================= TEXT ================= */}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>

      {/* ================= ACTIONS ================= */}
      {(actionHref || secondaryHref) && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {actionHref && (
            <Link
              href={actionHref}
              className="btn"
            >
              {actionLabel}
            </Link>
          )}

          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="btn-outline"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

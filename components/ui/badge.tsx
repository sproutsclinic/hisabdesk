import * as React from "react"
import { cn } from "@/lib/utils"

/* ==========================================================
   BADGE SYSTEM — Fintech Grade (Enterprise Safe)

   Purpose:
   • small status indicators
   • tags / chips
   • plan labels
   • table statuses

   Rules:
   • minimal
   • no flashy colors
   • consistent with Card/Button scale
   • server safe
========================================================== */

type Variant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline"

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

/* ================= VARIANTS ================= */

const variants: Record<Variant, string> = {
  default: `
    bg-zinc-100
    text-zinc-800
  `,

  success: `
    bg-green-100
    text-green-700
  `,

  warning: `
    bg-amber-100
    text-amber-700
  `,

  danger: `
    bg-red-100
    text-red-700
  `,

  info: `
    bg-blue-100
    text-blue-700
  `,

  outline: `
    border border-zinc-300
    text-zinc-700
    bg-transparent
  `,
}

/* ================= COMPONENT ================= */

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          `
          inline-flex items-center
          px-2.5 py-1
          text-xs font-medium
          rounded-full
          whitespace-nowrap
          `,
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* ========================================
   BUTTON SYSTEM — Fintech Grade

   Variants:
   • primary  (main CTA)
   • secondary
   • outline
   • ghost
   • danger
   • success

   Sizes:
   • sm
   • md
   • lg
   • icon

   Usage:
   <Button>Save</Button>
   <Button variant="outline" />
   <Button size="icon" />
======================================== */

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"

type Size = "sm" | "md" | "lg" | "icon"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

/* ================= VARIANTS ================= */

const variants: Record<Variant, string> = {
  primary: `
    bg-zinc-900 text-white
    hover:opacity-90
  `,
  secondary: `
    bg-zinc-100 text-zinc-900
    hover:bg-zinc-200
    dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700
  `,
  outline: `
    border border-zinc-300 dark:border-zinc-700
    hover:bg-zinc-100 dark:hover:bg-zinc-800
  `,
  ghost: `
    hover:bg-zinc-100 dark:hover:bg-zinc-800
  `,
  danger: `
    bg-red-600 text-white
    hover:opacity-90
  `,
  success: `
    bg-green-600 text-white
    hover:opacity-90
  `,
}

/* ================= SIZES ================= */

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-5 text-base rounded-xl",
  icon: "h-10 w-10 rounded-xl",
}

/* ================= COMPONENT ================= */

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        `
        inline-flex items-center justify-center gap-2
        font-medium
        transition
        active:scale-[0.98]
        disabled:opacity-50 disabled:pointer-events-none
        focus:outline-none focus:ring-2 focus:ring-zinc-400/40
        `,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span
          className="
            w-4 h-4
            border-2 border-white/40 border-t-white
            rounded-full animate-spin
          "
        />
      )}

      {children}
    </button>
  )
}

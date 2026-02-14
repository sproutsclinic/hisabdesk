import * as React from "react"
import { cn } from "@/lib/utils"

/* ========================================
   CARD SYSTEM — Fintech Grade (Hardened)

   ✔ server safe
   ✔ consistent spacing + radius
   ✔ clean shadow hierarchy
   ✔ NO dark mode (design system rule)
   ✔ stable interactive behavior
   ✔ accessible focus ring
   ✔ zero breaking API
======================================== */

type Variant = "default" | "soft" | "bordered" | "interactive"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

/* ========================================================
   BASE TOKENS (global consistency)
======================================================== */

const base = `
  rounded-2xl
  bg-white
  border border-gray-200
  p-5
  transition-all duration-150
`

/* ========================================================
   VARIANTS
======================================================== */

const variants: Record<Variant, string> = {
  default: `
    shadow-sm
  `,

  soft: `
    bg-gray-50
    border-gray-200
  `,

  bordered: `
    bg-transparent
    border-gray-300
  `,

  interactive: `
    shadow-sm
    hover:shadow-md
    hover:-translate-y-[1px]
    cursor-pointer
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-black/20
  `,
}

/* ================= MAIN ================= */

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"

/* ================= SUB COMPONENTS ================= */

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4 flex items-center justify-between", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-sm font-semibold tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-gray-500", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm space-y-3", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-4 pt-3 border-t border-gray-200 flex items-center justify-between",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

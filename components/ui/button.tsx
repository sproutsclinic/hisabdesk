import * as React from "react"
import { cn } from "@/lib/utils"

/* =====================================================
   HisabDesk — Button System (ENTERPRISE FINAL)

   ✔ forwardRef
   ✔ server-safe
   ✔ loading spinner (stable layout)
   ✔ keyboard accessible
   ✔ strict disabled handling
   ✔ consistent fintech sizing
   ✔ no layout shift while loading
===================================================== */

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
  icon: "h-10 w-10 rounded-xl p-0",
}

/* ================= COMPONENT ================= */

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(
          `
          relative
          inline-flex items-center justify-center gap-2
          font-medium whitespace-nowrap select-none
          transition-all duration-150
          active:scale-[0.98]

          disabled:opacity-50
          disabled:pointer-events-none

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-zinc-400/40
          `,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {/* spinner keeps width stable */}
        {loading && (
          <span
            className="
              absolute
              w-4 h-4
              border-2 border-current/30 border-t-current
              rounded-full animate-spin
            "
          />
        )}

        {/* hide text while loading to avoid shift */}
        <span className={loading ? "opacity-0" : "opacity-100"}>
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = "Button"

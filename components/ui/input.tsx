ï»¿"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* ==========================================================
   INPUT SYSTEM ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Enterprise Fintech Grade

   Fixes:
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ avoids HTML `size` collision (uses uiSize)
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ strict-mode safe
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ forwardRef everywhere
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ accessible + SSR safe
========================================================== */


/* ==========================================================
   UI SIZE SYSTEM (renamed to avoid DOM conflicts)
========================================================== */

type UISize = "sm" | "md" | "lg"

const sizes: Record<UISize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-3 text-sm rounded-xl",
  lg: "h-12 px-4 text-base rounded-xl",
}


/* ==========================================================
   FIELD WRAPPER
========================================================== */

export const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1.5", className)} {...props} />
))
Field.displayName = "Field"


/* ==========================================================
   LABEL
========================================================== */

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-xs font-medium text-zinc-700", className)}
    {...props}
  />
))
Label.displayName = "Label"


/* ==========================================================
   BASE INPUT STYLES
========================================================== */

const baseStyles = `
  w-full
  bg-white
  border border-zinc-300
  text-zinc-900
  placeholder:text-zinc-400
  transition-colors

  disabled:opacity-60
  disabled:cursor-not-allowed

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-zinc-900/20
  focus-visible:border-zinc-900

  [appearance:none]
`


/* ==========================================================
   INPUT
   IMPORTANT: remove native `size` using Omit<>
========================================================== */

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  uiSize?: UISize
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, uiSize = "md", type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(baseStyles, sizes[uiSize], className)}
      {...props}
    />
  )
)
Input.displayName = "Input"


/* ==========================================================
   TEXTAREA
========================================================== */

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  uiSize?: UISize
}

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, uiSize = "md", ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      baseStyles,
      "min-h-[110px] py-2 resize-none",
      sizes[uiSize],
      className
    )}
    {...props}
  />
))
Textarea.displayName = "Textarea"


/* ==========================================================
   SELECT
========================================================== */

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  uiSize?: UISize
}

export const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps
>(({ className, uiSize = "md", ...props }, ref) => (
  <select
    ref={ref}
    className={cn(baseStyles, sizes[uiSize], className)}
    {...props}
  />
))
Select.displayName = "Select"


/* ==========================================================
   HELPER TEXT
========================================================== */

export const HelperText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs text-zinc-500", className)} {...props} />
))
HelperText.displayName = "HelperText"


/* ==========================================================
   ERROR TEXT
========================================================== */

export const ErrorText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs font-medium text-red-600", className)}
    {...props}
  />
))
ErrorText.displayName = "ErrorText"

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* ========================================
   INPUT SYSTEM — Fintech Grade Forms

   Includes:
   • Input
   • Label
   • Field (wrapper)
   • HelperText
   • ErrorText
   • Textarea
   • Select

   Usage:

   <Field>
     <Label>Email</Label>
     <Input />
     <HelperText>Optional</HelperText>
   </Field>
======================================== */

/* ================= FIELD WRAPPER ================= */

export function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1.5", className)} {...props} />
  )
}

/* ================= LABEL ================= */

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-xs font-medium text-zinc-700 dark:text-zinc-300",
        className
      )}
      {...props}
    />
  )
}

/* ================= INPUT ================= */

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        `
        w-full
        h-10
        px-3
        text-sm
        rounded-xl

        bg-white dark:bg-zinc-900
        border border-zinc-300 dark:border-zinc-700

        placeholder:text-zinc-400

        focus:outline-none
        focus:ring-2 focus:ring-zinc-900/20
        focus:border-zinc-900

        transition
        `,
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

/* ================= TEXTAREA ================= */

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        `
        w-full
        min-h-[100px]
        px-3 py-2
        text-sm
        rounded-xl

        bg-white dark:bg-zinc-900
        border border-zinc-300 dark:border-zinc-700

        focus:outline-none
        focus:ring-2 focus:ring-zinc-900/20
        focus:border-zinc-900

        transition
        resize-none
        `,
        className
      )}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

/* ================= SELECT ================= */

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        `
        w-full
        h-10
        px-3
        text-sm
        rounded-xl

        bg-white dark:bg-zinc-900
        border border-zinc-300 dark:border-zinc-700

        focus:outline-none
        focus:ring-2 focus:ring-zinc-900/20
        focus:border-zinc-900

        transition
        `,
        className
      )}
      {...props}
    />
  )
})

Select.displayName = "Select"

/* ================= HELPER ================= */

export function HelperText({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs text-zinc-500",
        className
      )}
      {...props}
    />
  )
}

/* ================= ERROR ================= */

export function ErrorText({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs text-red-600 font-medium",
        className
      )}
      {...props}
    />
  )
}

"use client"

import { cn } from "@/lib/utils"
import React from "react"

/* ========================================
   CARD SYSTEM — Fintech Grade

   Variants:
   • default
   • soft
   • bordered
   • interactive

   Usage:
   <Card>
     <CardHeader />
     <CardContent />
   </Card>

   <Card variant="interactive" />
======================================== */

type Variant = "default" | "soft" | "bordered" | "interactive"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  default: `
    bg-white dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-800
    shadow-sm
  `,
  soft: `
    bg-zinc-50 dark:bg-zinc-900/60
    border border-zinc-200/60 dark:border-zinc-800
  `,
  bordered: `
    bg-transparent
    border border-zinc-300 dark:border-zinc-700
  `,
  interactive: `
    bg-white dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-800
    shadow-sm
    hover:shadow-md
    transition
    cursor-pointer
  `,
}

/* ================= MAIN ================= */

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 sm:p-5",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

/* ================= SUB COMPONENTS ================= */

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-3 flex items-center justify-between",
        className
      )}
      {...props}
    />
  )
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export function CardDescription({
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

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm", className)}
      {...props}
    />
  )
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between",
        className
      )}
      {...props}
    />
  )
}

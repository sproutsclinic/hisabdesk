import * as React from "react"
import { cn } from "@/lib/utils"

/* ==========================================================
   TABLE SYSTEM — Fintech Grade (Enterprise Safe)

   Goals:
   • clean accounting look
   • consistent spacing with Card/Input/Button
   • mobile scroll safe
   • no dark mode noise
   • zero dependencies
========================================================== */

/* ================= WRAPPER ================= */

export const TableWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full overflow-x-auto rounded-2xl border border-zinc-200 bg-white",
      className
    )}
    {...props}
  />
))
TableWrapper.displayName = "TableWrapper"

/* ================= TABLE ================= */

export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn(
      "w-full text-sm border-collapse",
      className
    )}
    {...props}
  />
))
Table.displayName = "Table"

/* ================= HEAD ================= */

export const THead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-zinc-50 text-zinc-500", className)}
    {...props}
  />
))
THead.displayName = "THead"

export const TH = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "text-left font-medium px-4 py-3 whitespace-nowrap",
      className
    )}
    {...props}
  />
))
TH.displayName = "TH"

/* ================= BODY ================= */

export const TBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
))
TBody.displayName = "TBody"

export const TR = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-t border-zinc-200 hover:bg-zinc-50 transition-colors",
      className
    )}
    {...props}
  />
))
TR.displayName = "TR"

export const TD = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 whitespace-nowrap text-zinc-900",
      className
    )}
    {...props}
  />
))
TD.displayName = "TD"

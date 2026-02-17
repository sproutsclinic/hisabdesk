ï»¿"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

/* ==========================================================
   DROPDOWN SYSTEM ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Enterprise Safe
========================================================== */

type Ctx = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerRef: React.RefObject<HTMLElement | null> // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ FIXED TYPE
}

const DropdownContext = React.createContext<Ctx | null>(null)

function useDropdown() {
  const ctx = React.useContext(DropdownContext)
  if (!ctx) throw new Error("Dropdown components must be inside <Dropdown />")
  return ctx
}

/* ========================================================== */
/* ROOT */
/* ========================================================== */

export function Dropdown({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ must allow null during lifecycle
  const triggerRef = React.useRef<HTMLElement | null>(null)

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

/* ========================================================== */
/* TRIGGER */
/* ========================================================== */

export function DropdownTrigger({
  children,
}: {
  children: React.ReactElement
}) {
  const { open, setOpen, triggerRef } = useDropdown()

  return (
    <span
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      style={{ display: "inline-block" }}
    >
      {children}
    </span>
  )
}
/* ========================================================== */
/* CONTENT */
/* ========================================================== */

export function DropdownContent({
  className,
  align = "right",
  children,
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: "left" | "right"
}) {
  const { open, setOpen, triggerRef } = useDropdown()
  const [mounted, setMounted] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => setMounted(true), [])

  /* Close on outside click */
  React.useEffect(() => {
    if (!open) return

    const handle = (e: MouseEvent) => {
      const target = e.target as Node

      if (
        !contentRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }

    window.addEventListener("mousedown", handle)
    return () => window.removeEventListener("mousedown", handle)
  }, [open, setOpen, triggerRef])

  /* Escape key closes */
  React.useEffect(() => {
    if (!open) return

    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [open, setOpen])

  if (!mounted || !open) return null

  const rect = triggerRef.current?.getBoundingClientRect()

  const style: React.CSSProperties = {
    position: "fixed",
    top: (rect?.bottom ?? 0) + 6,
    left: align === "right"
      ? (rect?.right ?? 0) - 180
      : rect?.left ?? 0,
  }

  return createPortal(
    <div
      ref={contentRef}
      style={style}
      className={cn(
        `
        z-[150]
        w-44
        rounded-xl
        bg-white
        border border-zinc-200
        shadow-lg
        p-1
        animate-in fade-in zoom-in-95
        `,
        className
      )}
    >
      {children}
    </div>,
    document.body
  )
}

/* ========================================================== */
/* ITEM */
/* ========================================================== */

export function DropdownItem({
  className,
  danger = false,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  danger?: boolean
}) {
  const { setOpen } = useDropdown()

  return (
    <button
      onClick={(e) => {
        props.onClick?.(e)
        setOpen(false)
      }}
      className={cn(
        `
        w-full text-left
        px-3 py-2
        text-sm rounded-lg
        hover:bg-zinc-100
        transition
        `,
        danger && "text-red-600 hover:bg-red-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/* ========================================================== */
/* SEPARATOR */
/* ========================================================== */

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-zinc-200" />
}

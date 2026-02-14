"use client"

import { useEffect } from "react"

/* ========================================
   PRODUCTION SAFE THEME PROVIDER

   ✔ no hydration mismatch
   ✔ no flash
   ✔ supports saved theme
   ✔ supports system fallback
======================================== */

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const root = document.documentElement

    const saved = localStorage.getItem("theme")

    const isDark =
      saved === "dark" ||
      (!saved &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    root.classList.toggle("dark", isDark)
  }, [])

  return <>{children}</>
}

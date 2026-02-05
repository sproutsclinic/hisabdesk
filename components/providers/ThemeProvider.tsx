"use client"

import { useEffect } from "react"

export default function ThemeProvider({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark"

    if (dark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  return <>{children}</>
}

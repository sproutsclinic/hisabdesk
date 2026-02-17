ï»¿"use client"

import { useEffect, useState } from "react"

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="text-sm border rounded px-3 py-1"
    >
      {dark ? "Light" : "Dark"}
    </button>
  )
}

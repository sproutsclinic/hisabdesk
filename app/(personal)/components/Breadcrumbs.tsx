"use client"

import { usePathname } from "next/navigation"

export default function Breadcrumbs() {
  const pathname = usePathname()

  const parts = pathname
    .split("/")
    .filter(Boolean)
    .slice(1) // remove "(personal)"

  if (parts.length === 0) return null

  return (
    <div className="text-xs text-muted-foreground flex gap-2">
      {parts.map((p, i) => (
        <span key={i} className="capitalize">
          {p.replace("-", " ")}
          {i !== parts.length - 1 && " / "}
        </span>
      ))}
    </div>
  )
}

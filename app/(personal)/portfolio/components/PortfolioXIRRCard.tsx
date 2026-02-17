ï»¿"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function PortfolioXIRRCard() {
  const [value, setValue] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/portfolio/xirr")
      .then((r) => r.json())
      .then((j) => setValue(j.xirr))
  }, [])

  return (
    <Card className="p-4 text-center">
      <p className="text-xs text-muted-foreground">
        Portfolio Return (XIRR)
      </p>

      <p
        className={`text-xl font-semibold ${
          value && value > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {value ?? 0}%
      </p>
    </Card>
  )
}

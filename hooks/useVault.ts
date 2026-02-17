ï»¿"use client"

import { useEffect, useState } from "react"
import type {
  VaultOverview,
  VaultCategory,
} from "@/lib/api/vault/types"

export function useVault() {
  const [overview, setOverview] =
    useState<VaultOverview | null>(null)

  const [loading, setLoading] = useState(false)

  const fetchOverview = async () => {
    setLoading(true)

    const res = await fetch("/api/vault")
    const json = await res.json()

    setOverview(json.data)
    setLoading(false)
  }

  const remove = async (id: string) => {
    await fetch(`/api/vault?id=${id}`, { method: "DELETE" })
    fetchOverview()
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  return { overview, loading, remove }
}

ï»¿"use client"

/* =========================================================
   useBills
   Thin client only
   ========================================================= */

import { useCallback, useEffect, useState } from "react"

import type {
  BillsOverview,
  CreateBillRequest,
  UpdateBillRequest,
} from "@/lib/api/bills/types"

interface State {
  loading: boolean
  error: string | null
  overview: BillsOverview | null
}

export function useBills() {
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    overview: null,
  })

  const setLoading = (loading: boolean) =>
    setState((s) => ({ ...s, loading }))

  const setError = (error: string | null) =>
    setState((s) => ({ ...s, error }))

  /* =======================================================
     FETCH
     ======================================================= */

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/bills")

      if (!res.ok) throw new Error("Failed to load bills")

      const json = await res.json()

      setState((s) => ({ ...s, overview: json.data }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  /* =======================================================
     CREATE
     ======================================================= */

  const create = useCallback(
    async (payload: CreateBillRequest) => {
      await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      await fetchOverview()
    },
    [fetchOverview],
  )

  /* =======================================================
     UPDATE
     ======================================================= */

  const update = useCallback(
    async (payload: UpdateBillRequest) => {
      await fetch("/api/bills", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      await fetchOverview()
    },
    [fetchOverview],
  )

  /* =======================================================
     DELETE
     ======================================================= */

  const remove = useCallback(
    async (id: string) => {
      await fetch(`/api/bills?id=${id}`, {
        method: "DELETE",
      })

      await fetchOverview()
    },
    [fetchOverview],
  )

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  return {
    ...state,
    fetchOverview,
    create,
    update,
    remove,
  }
}

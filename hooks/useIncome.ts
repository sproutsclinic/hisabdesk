"use client"

/* =========================================================
   useIncome
   Thin client fetch hook
   ========================================================= */

import { useCallback, useEffect, useState } from "react"

import type {
  IncomeRow,
  CreateIncomeRequest,
  UpdateIncomeRequest,
} from "@/lib/api/income/types"

interface State {
  loading: boolean
  error: string | null
  rows: IncomeRow[]
  total: number
}

export function useIncome() {
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    rows: [],
    total: 0,
  })

  /* ------------------------------------------------------- */
  /* helpers */
  /* ------------------------------------------------------- */

  const setLoading = (loading: boolean) =>
    setState((s) => ({ ...s, loading }))

  const setError = (error: string | null) =>
    setState((s) => ({ ...s, error }))

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/income")

      if (!res.ok) throw new Error("Failed to load income")

      const json = await res.json()

      setState((s) => ({
        ...s,
        rows: json.data.rows ?? [],
        total: json.data.total ?? 0,
      }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  /* =======================================================
     CREATE
  ======================================================= */

  const create = useCallback(async (payload: CreateIncomeRequest) => {
    await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    await fetchAll()
  }, [fetchAll])

  /* =======================================================
     UPDATE
  ======================================================= */

  const update = useCallback(async (payload: UpdateIncomeRequest) => {
    await fetch("/api/income", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    await fetchAll()
  }, [fetchAll])

  /* =======================================================
     DELETE
  ======================================================= */

  const remove = useCallback(async (id: string) => {
    await fetch(`/api/income?id=${id}`, {
      method: "DELETE",
    })

    await fetchAll()
  }, [fetchAll])

  /* ======================================================= */

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return {
    ...state,
    fetchAll,
    create,
    update,
    remove,
  }
}

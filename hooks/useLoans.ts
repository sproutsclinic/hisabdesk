/* =========================================================
   HisabDesk — useLoans Hook
   ---------------------------------------------------------
   CLIENT SIDE ONLY

   PURPOSE
   - Call server APIs
   - Manage loading/state
   - ZERO business logic
   - ZERO calculations
   - ZERO Supabase direct access

   ARCHITECTURE
     Component → hook → /api/loans → service → engine

   RULES
   ✅ thin client
   ✅ fetch only
   ❌ no math
   ❌ no DB
   ❌ no AI

   ========================================================= */

"use client"

import { useCallback, useEffect, useState } from "react"

import type {
  LoanOverview,
  CreateLoanRequest,
  UpdateLoanRequest,
} from "@/lib/api/loans/types"

/* =========================================================
   STATE
   ========================================================= */

interface UseLoansState {
  loading: boolean
  error: string | null
  overview: LoanOverview | null
}

/* =========================================================
   HOOK
   ========================================================= */

export function useLoans() {
  const [state, setState] = useState<UseLoansState>({
    loading: false,
    error: null,
    overview: null,
  })

  /* -------------------------------------------------------
     HELPERS
     ------------------------------------------------------- */

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

      const res = await fetch("/api/loans")

      if (!res.ok) throw new Error("Failed to load loans")

      const json = await res.json()

      setState((s) => ({
        ...s,
        overview: json.data,
      }))
    } catch (err: any) {
      setError(err.message || "Load failed")
    } finally {
      setLoading(false)
    }
  }, [])

  /* =======================================================
     CREATE
     ======================================================= */

  const create = useCallback(
    async (payload: CreateLoanRequest) => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/loans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error("Create failed")

        await fetchOverview()
      } catch (err: any) {
        setError(err.message || "Create failed")
      } finally {
        setLoading(false)
      }
    },
    [fetchOverview],
  )

  /* =======================================================
     UPDATE
     ======================================================= */

  const update = useCallback(
    async (payload: UpdateLoanRequest) => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/loans", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error("Update failed")

        await fetchOverview()
      } catch (err: any) {
        setError(err.message || "Update failed")
      } finally {
        setLoading(false)
      }
    },
    [fetchOverview],
  )

  /* =======================================================
     DELETE
     ======================================================= */

  const remove = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/loans?id=${id}`, {
          method: "DELETE",
        })

        if (!res.ok) throw new Error("Delete failed")

        await fetchOverview()
      } catch (err: any) {
        setError(err.message || "Delete failed")
      } finally {
        setLoading(false)
      }
    },
    [fetchOverview],
  )

  /* =======================================================
     AUTO LOAD
     ======================================================= */

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  /* =======================================================
     EXPORT
     ======================================================= */

  return {
    ...state,
    fetchOverview,
    create,
    update,
    remove,
  }
}

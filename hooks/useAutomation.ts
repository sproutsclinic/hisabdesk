ï»¿/* =========================================================
   HisabDesk ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â useAutomation Hook
   ---------------------------------------------------------
   CLIENT SIDE ONLY

   PURPOSE
   - Call server APIs
   - Manage loading/state
   - ZERO business logic
   - ZERO calculations
   - ZERO Supabase direct access

   ARCHITECTURE
     Component ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ hook ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ /api/automation ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ service ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ engine

   RULES
   ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ thin client
   ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ fetch only
   ÃƒÂ¢Ã‚ÂÃ…â€™ no math
   ÃƒÂ¢Ã‚ÂÃ…â€™ no DB
   ÃƒÂ¢Ã‚ÂÃ…â€™ no AI

   ========================================================= */

"use client"

import { useCallback, useEffect, useState } from "react"

import type {
  AutomationOverview,
  CreateAutomationRuleRequest,
  UpdateAutomationRuleRequest,
} from "@/lib/api/automation/types"

/* =========================================================
   STATE
   ========================================================= */

interface UseAutomationState {
  loading: boolean
  error: string | null
  overview: AutomationOverview | null
}

/* =========================================================
   HOOK
   ========================================================= */

export function useAutomation() {
  const [state, setState] = useState<UseAutomationState>({
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

      const res = await fetch("/api/automation")

      if (!res.ok) throw new Error("Failed to load rules")

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
    async (payload: CreateAutomationRuleRequest) => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/automation", {
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
    async (payload: UpdateAutomationRuleRequest) => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/automation", {
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

        const res = await fetch(`/api/automation?id=${id}`, {
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

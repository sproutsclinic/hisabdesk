ï»¿/* =========================================================
   HisabDesk ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â useProfile Hook
   ---------------------------------------------------------
   CLIENT SIDE ONLY

   PURPOSE
   - Fetch profile
   - Update preferences
   - Manage loading/state
   - ZERO business logic
   - ZERO calculations
   - ZERO Supabase direct access

   ARCHITECTURE
     Component ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ hook ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ /api/profile ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ service ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ DB

   RULES
   ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ thin client
   ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ fetch only
   ÃƒÂ¢Ã‚ÂÃ…â€™ no DB
   ÃƒÂ¢Ã‚ÂÃ…â€™ no math
   ÃƒÂ¢Ã‚ÂÃ…â€™ no AI

   ========================================================= */

"use client"

import { useCallback, useEffect, useState } from "react"

import type {
  ProfileRow,
  UpdateProfileRequest,
} from "@/lib/api/profile/types"

/* =========================================================
   STATE
   ========================================================= */

interface UseProfileState {
  loading: boolean
  error: string | null
  profile: ProfileRow | null
}

/* =========================================================
   HOOK
   ========================================================= */

export function useProfile() {
  const [state, setState] = useState<UseProfileState>({
    loading: false,
    error: null,
    profile: null,
  })

  /* ------------------------------------------------------- */
  /* HELPERS */
  /* ------------------------------------------------------- */

  const setLoading = (loading: boolean) =>
    setState((s) => ({ ...s, loading }))

  const setError = (error: string | null) =>
    setState((s) => ({ ...s, error }))

  /* =======================================================
     FETCH PROFILE
     ======================================================= */

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/profile")

      if (!res.ok) throw new Error("Failed to load profile")

      const json = await res.json()

      setState((s) => ({
        ...s,
        profile: json.data?.profile ?? json.data ?? null,
      }))
    } catch (err: any) {
      setError(err.message || "Load failed")
    } finally {
      setLoading(false)
    }
  }, [])

  /* =======================================================
     UPDATE PROFILE
     ======================================================= */

  const update = useCallback(
    async (payload: UpdateProfileRequest) => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error("Update failed")

        const json = await res.json()

        setState((s) => ({
          ...s,
          profile: json.data ?? null,
        }))
      } catch (err: any) {
        setError(err.message || "Update failed")
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  /* =======================================================
     AUTO LOAD
     ======================================================= */

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  /* =======================================================
     EXPORT
     ======================================================= */

  return {
    ...state,
    fetchProfile,
    update,
  }
}

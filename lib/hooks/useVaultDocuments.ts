"use client"

// ==========================================================
// HisabDesk — useVaultDocuments
// ----------------------------------------------------------
// PURPOSE
//   Client hook for Vault document management
//
//   Responsibilities:
//     ✓ fetch list
//     ✓ upload
//     ✓ delete
//     ✓ loading state
//     ✓ refresh
//
//   RULES
//     ✓ NO Supabase here
//     ✓ ONLY call server routes via lib/api/vault
//     ✓ thin client layer only
//
//   Usage:
//
//     const {
//       documents,
//       loading,
//       upload,
//       remove,
//       refresh
//     } = useVaultDocuments()
//
// ==========================================================

import { useCallback, useEffect, useState } from "react"
import {
  deleteDocument,
  uploadDocument,
  VaultDocument,
} from "@/lib/api/vault"

// ==========================================================
// HOOK
// ==========================================================

export function useVaultDocuments() {
  const [documents, setDocuments] = useState<VaultDocument[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------
  // FETCH LIST
  // --------------------------------------------------------

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/vault/list", {
        cache: "no-store",
      })

      const json = await res.json()

      setDocuments(json || [])
    } finally {
      setLoading(false)
    }
  }, [])

  // --------------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------------

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  // --------------------------------------------------------
  // UPLOAD
  // --------------------------------------------------------

  const upload = useCallback(
    async (file: File, category: string) => {
      await uploadDocument(file, category)
      await fetchDocuments()
    },
    [fetchDocuments]
  )

  // --------------------------------------------------------
  // DELETE
  // --------------------------------------------------------

  const remove = useCallback(
    async (id: string) => {
      await deleteDocument(id)
      await fetchDocuments()
    },
    [fetchDocuments]
  )

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    documents,
    loading,
    upload,
    remove,
    refresh: fetchDocuments,
  }
}

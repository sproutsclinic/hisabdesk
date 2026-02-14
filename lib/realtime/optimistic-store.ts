"use client"

/**
 * =========================================================
 * Optimistic Store (Instant UI Updates Engine)
 * HisabDesk – Phase E (Realtime + UX)
 * =========================================================
 *
 * PURPOSE
 * Makes UI feel INSTANT before server responds.
 *
 * WITHOUT THIS
 *   ❌ click → wait → update
 *
 * WITH THIS
 *   ✓ click → instant UI update
 *   ✓ server sync in background
 *   ✓ revert on failure
 *
 * Used by modern SaaS:
 *   ✓ Notion
 *   ✓ Stripe
 *   ✓ Linear
 *   ✓ Slack
 *
 * =========================================================
 *
 * WHAT IT DOES
 *
 * 1. Immediately update UI (optimistic)
 * 2. Call API
 * 3. If success → keep
 * 4. If fail → rollback
 *
 * =========================================================
 *
 * USAGE
 *
 * import { optimisticUpdate } from "@/lib/realtime/optimistic-store"
 *
 * await optimisticUpdate({
 *   list,
 *   setList,
 *   newItem,
 *   api: () => fetch(...)
 * })
 *
 * =========================================================
 *
 * SAFE
 * - client only
 * - generic
 * - no DB logic
 * - reusable anywhere
 * =========================================================
 */

type Options<T> = {
  list: T[]
  setList: (v: T[]) => void
  newItem: T
  api: () => Promise<any>
  position?: "start" | "end"
}

/* =========================================================
   MAIN
========================================================= */

export async function optimisticUpdate<T>({
  list,
  setList,
  newItem,
  api,
  position = "start",
}: Options<T>) {
  /* ------------------------------------------------------
     SNAPSHOT (for rollback)
  ------------------------------------------------------ */

  const snapshot = [...list]

  /* ------------------------------------------------------
     INSTANT UI UPDATE
  ------------------------------------------------------ */

  const updated =
    position === "start"
      ? [newItem, ...list]
      : [...list, newItem]

  setList(updated)

  /* ------------------------------------------------------
     CALL API
  ------------------------------------------------------ */

  try {
    await api()
  } catch (err) {
    /* ----------------------------------------------------
       ROLLBACK ON FAILURE
    ---------------------------------------------------- */
    setList(snapshot)
    throw err
  }
}

/* =========================================================
   REMOVE OPTIMISTIC
========================================================= */

type RemoveOptions<T> = {
  list: T[]
  setList: (v: T[]) => void
  predicate: (item: T) => boolean
  api: () => Promise<any>
}

export async function optimisticRemove<T>({
  list,
  setList,
  predicate,
  api,
}: RemoveOptions<T>) {
  const snapshot = [...list]

  const filtered = list.filter((i) => !predicate(i))

  setList(filtered)

  try {
    await api()
  } catch {
    setList(snapshot)
  }
}

/* =========================================================
   UPDATE OPTIMISTIC
========================================================= */

type PatchOptions<T> = {
  list: T[]
  setList: (v: T[]) => void
  predicate: (item: T) => boolean
  patch: Partial<T>
  api: () => Promise<any>
}

export async function optimisticPatch<T>({
  list,
  setList,
  predicate,
  patch,
  api,
}: PatchOptions<T>) {
  const snapshot = [...list]

  const updated = list.map((item) =>
    predicate(item) ? { ...item, ...patch } : item
  )

  setList(updated)

  try {
    await api()
  } catch {
    setList(snapshot)
  }
}

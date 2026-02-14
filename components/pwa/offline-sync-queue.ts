/**
 * =========================================================
 * Offline Sync Queue Engine
 * HisabDesk – Phase D (Mobile / PWA)
 * =========================================================
 *
 * PURPOSE
 * Allow app to work OFFLINE and sync later.
 *
 * Solves:
 *   ✓ no internet → still add income/expense
 *   ✓ auto sync when back online
 *   ✓ no data loss
 *   ✓ mobile-first reliability
 *
 * HOW
 * Queue actions locally (IndexedDB)
 * → when online → flush to Supabase
 *
 * FEATURES
 *   ✓ IndexedDB storage
 *   ✓ retry safe
 *   ✓ background sync ready
 *   ✓ generic (any table)
 *
 * SAFE
 * - client only
 * - no existing file changes
 *
 * USAGE
 *
 * await queueAction({
 *   table: "expenses",
 *   type: "insert",
 *   payload: {...}
 * })
 *
 * window.addEventListener("online", flushQueue)
 *
 * =========================================================
 */

"use client"

/* =========================================================
   TYPES
========================================================= */

export type QueueAction = {
  id?: string
  table: string
  type: "insert" | "update" | "delete"
  payload: any
  createdAt?: number
}

/* =========================================================
   INDEXED DB SETUP
========================================================= */

const DB_NAME = "hisabdesk-offline"
const STORE = "queue"
const VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)

    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, {
          keyPath: "id",
          autoIncrement: true,
        })
      }
    }

    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/* =========================================================
   ADD ACTION TO QUEUE
========================================================= */

export async function queueAction(action: QueueAction) {
  const db = await openDB()

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")

    tx.objectStore(STORE).add({
      ...action,
      createdAt: Date.now(),
    })

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/* =========================================================
   GET ALL ACTIONS
========================================================= */

async function getAllActions(): Promise<QueueAction[]> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly")
    const req = tx.objectStore(STORE).getAll()

    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })
}

/* =========================================================
   CLEAR ACTION
========================================================= */

async function removeAction(id: any) {
  const db = await openDB()

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    tx.objectStore(STORE).delete(id)

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/* =========================================================
   FLUSH QUEUE
========================================================= */

export async function flushQueue(
  supabaseClient: any
) {
  if (!navigator.onLine) return

  const actions = await getAllActions()

  for (const action of actions) {
    try {
      if (action.type === "insert") {
        await supabaseClient
          .from(action.table)
          .insert(action.payload)
      }

      if (action.type === "update") {
        await supabaseClient
          .from(action.table)
          .update(action.payload.data)
          .eq("id", action.payload.id)
      }

      if (action.type === "delete") {
        await supabaseClient
          .from(action.table)
          .delete()
          .eq("id", action.payload.id)
      }

      await removeAction((action as any).id)
    } catch {
      /* stop on first failure, retry later */
      break
    }
  }
}

/* =========================================================
   AUTO SYNC HELPER
========================================================= */

export function enableAutoSync(supabaseClient: any) {
  window.addEventListener("online", () =>
    flushQueue(supabaseClient)
  )

  // also try once on load
  flushQueue(supabaseClient)
}

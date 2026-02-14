/*
  PHASE 18 — Restore Helper (Client)

  Usage:

  import { restoreBackup } from "@/lib/import/restore"

  await restoreBackup(file)
*/

export async function restoreBackup(file: File) {
  const text = await file.text()

  const res = await fetch("/api/admin/import/restore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: text,
  })

  if (!res.ok) {
    throw new Error("Restore failed")
  }

  return true
}

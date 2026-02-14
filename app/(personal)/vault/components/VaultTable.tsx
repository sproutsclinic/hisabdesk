"use client"

import { Card } from "@/components/ui/card"
import type { VaultFileRow } from "@/lib/api/vault/types"

export default function VaultTable({
  rows,
  onDelete,
}: {
  rows: VaultFileRow[]
  onDelete: (id: string) => void
}) {
  return (
    <Card className="p-4 space-y-2">
      {rows.map((r) => (
        <div
          key={r.id}
          className="flex justify-between border p-2 rounded text-sm"
        >
          <span>{r.name}</span>

          <button onClick={() => onDelete(r.id)}>
            Delete
          </button>
        </div>
      ))}
    </Card>
  )
}

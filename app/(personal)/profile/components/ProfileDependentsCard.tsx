"use client"

import { Card } from "@/components/ui/card"
import type { ProfileRow, UpdateProfileRequest } from "@/lib/api/profile/types"

interface Props {
  profile: ProfileRow
  onSave: (payload: UpdateProfileRequest) => void
}

export default function ProfileDependentsCard({ profile, onSave }: Props) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-medium">Dependents</h2>

      <input
        type="number"
        min={0}
        value={profile.dependents ?? 0}
        onChange={(e) =>
          onSave({ dependents: Number(e.target.value) })
        }
        className="border rounded p-2 w-40"
      />
    </Card>
  )
}

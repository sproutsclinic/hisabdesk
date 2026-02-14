"use client"

import { Card } from "@/components/ui/card"
import type { ProfileRow, UpdateProfileRequest } from "@/lib/api/profile/types"

interface Props {
  profile: ProfileRow
  onSave: (payload: UpdateProfileRequest) => void
}

export default function ProfilePreferencesCard({ profile, onSave }: Props) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-medium">Preferences</h2>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={profile.notifications_enabled}
          onChange={(e) =>
            onSave({ notifications_enabled: e.target.checked })
          }
        />
        <span className="text-sm">Enable Notifications</span>
      </div>

      <input
        placeholder="Currency (₹, $, €)"
        value={profile.currency || "₹"}
        onChange={(e) =>
          onSave({ currency: e.target.value })
        }
        className="border rounded p-2 w-32"
      />
    </Card>
  )
}

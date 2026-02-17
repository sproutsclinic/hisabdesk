ï»¿"use client"

import { Card } from "@/components/ui/card"

interface Props {
  open: boolean
  notifications: {
    id: string
    title: string
    message: string
  }[]
}

export default function NotificationPanel({
  open,
  notifications,
}: Props) {
  if (!open) return null

  return (
    <Card className="absolute right-0 mt-2 w-80 p-3 shadow-lg z-50">
      <div className="text-sm font-medium mb-2">
        Notifications
      </div>

      {notifications.length === 0 && (
        <div className="text-xs text-muted-foreground">
          No notifications
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className="border rounded p-2 text-xs">
            <div className="font-medium">{n.title}</div>
            <div className="text-muted-foreground">
              {n.message}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

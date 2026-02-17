ï»¿/* =========================================================
   Notifications Types
   ========================================================= */

export type NotificationType =
  | "info"
  | "warning"
  | "success"

export interface NotificationRow {
  id: string
  user_id: string

  title: string
  message: string

  type: NotificationType

  read: boolean

  created_at: string
}

export interface NotificationsOverview {
  rows: NotificationRow[]
  unread: number
}

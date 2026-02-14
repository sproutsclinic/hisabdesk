"use client"

import Breadcrumbs from "./Breadcrumbs"

export default function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Breadcrumbs />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {actions}
      </div>
    </div>
  )
}

import { ReactNode } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PageShellProps {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}

/**
 * 后台页面统一容器。
 */
export function PageShell({ title, description, action, children }: PageShellProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {action}
        </div>
        {children}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
}

/**
 * 后台列表空状态。
 */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">可以先新增一条数据，或者调整筛选条件。</CardContent>
    </Card>
  )
}

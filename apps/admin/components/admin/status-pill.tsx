import { Badge } from "@/components/ui/badge"

/**
 * 启用/禁用状态标签。
 */
export function EnabledBadge({ enabled }: { enabled: boolean }) {
  return (
    <Badge variant={enabled ? "default" : "secondary"} className={enabled ? "bg-emerald-600" : ""}>
      {enabled ? "启用" : "禁用"}
    </Badge>
  )
}

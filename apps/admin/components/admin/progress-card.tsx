/**
 * 运营总览中的进度指标卡片。
 */
export function ProgressCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  const numericValue = Number(value.replace("%", ""))

  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm font-semibold text-emerald-600">{value}</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${numericValue}%` }} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

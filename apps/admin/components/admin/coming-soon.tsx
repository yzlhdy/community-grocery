import { PageShell } from "@/components/admin/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * 尚未展开的后台模块占位页。
 */
export function ComingSoonPage({ title, description }: { title: string; description: string }) {
  return (
    <PageShell title={title} description={description}>
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>模块建设中</CardTitle>
          <CardDescription>侧边栏和路由已经预留，后续可以按同样 CRUD 规范继续扩展。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          建议下一批优先补订单管理、售后审核、优惠券和营销活动。
        </CardContent>
      </Card>
    </PageShell>
  )
}

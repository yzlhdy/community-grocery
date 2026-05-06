import { BarChart3, PackageCheck, ShoppingCart, Store, Truck } from "lucide-react"

import { PageShell } from "@/components/admin/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressCard } from "@/components/admin/progress-card"

const metrics = [
  { label: "今日订单", value: "128", description: "较昨日 +12.5%", icon: ShoppingCart },
  { label: "待自提", value: "36", description: "18:30 前需处理", icon: Truck },
  { label: "在售商品", value: "246", description: "SKU 库存健康", icon: PackageCheck },
  { label: "服务小区", value: "18", description: "覆盖 4 个自提点", icon: Store },
]

const todoList = ["核对待自提订单", "检查低库存 SKU", "更新今日秒杀商品", "处理售后退款申请"]

export default function DashboardPage() {
  return (
    <PageShell title="运营总览" description="社区买菜后台的订单、商品、库存和履约状态。">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
              <metric.icon className="size-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>今日经营节奏</CardTitle>
                <CardDescription>先把履约和库存打稳，运营就不慌。</CardDescription>
              </div>
              <Badge className="bg-emerald-600">实时</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <ProgressCard title="支付转化" value="68%" hint="目标 72%" />
            <ProgressCard title="自提完成" value="83%" hint="高峰 18:00-19:30" />
            <ProgressCard title="库存健康" value="91%" hint="低库存 12 个" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-emerald-600" />
              今日待办
            </CardTitle>
            <CardDescription>建议按照这个顺序处理。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todoList.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                  {index + 1}
                </span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PageShell>
  )
}

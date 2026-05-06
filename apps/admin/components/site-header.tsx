"use client"

import { usePathname } from "next/navigation"
import { Search, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const titleMap: Record<string, string> = {
  "/dashboard": "运营总览",
  "/products": "商品管理",
  "/categories": "分类管理",
  "/communities": "小区管理",
  "/pickup-points": "自提点管理",
  "/orders": "订单管理",
  "/customers": "用户管理",
  "/marketing": "营销活动",
  "/coupons": "优惠券",
  "/after-sales": "售后审核",
  "/notifications": "通知中心",
}

/**
 * 后台顶部栏。
 */
export function SiteHeader() {
  const pathname = usePathname()
  const title = titleMap[pathname] ?? "社区买菜后台"

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-semibold">{title}</h1>
        <Badge variant="secondary" className="hidden gap-1 rounded-full md:inline-flex">
          <Sparkles className="size-3" />
          第一阶段运营台
        </Badge>
        <div className="ml-auto hidden w-72 items-center md:flex">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input className="h-9 pl-8" placeholder="搜索商品、订单、小区..." />
          </div>
        </div>
      </div>
    </header>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import {
  BadgePercentIcon,
  BellIcon,
  BoxesIcon,
  ClipboardCheckIcon,
  LayoutDashboardIcon,
  MapPinnedIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StoreIcon,
  TicketPercentIcon,
  UsersIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "运营管理员",
    email: "admin@community-grocery.local",
    avatar: "",
  },
  navMain: [
    { title: "运营总览", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "商品管理", url: "/products", icon: PackageIcon },
    { title: "分类管理", url: "/categories", icon: BoxesIcon },
    { title: "订单管理", url: "/orders", icon: ShoppingCartIcon },
    { title: "用户管理", url: "/customers", icon: UsersIcon },
  ],
  navSecondary: [
    { title: "系统设置", url: "/settings", icon: SettingsIcon },
    { title: "全局搜索", url: "/search", icon: SearchIcon },
  ],
  documents: [
    { name: "小区管理", url: "/communities", icon: StoreIcon },
    { name: "自提点管理", url: "/pickup-points", icon: MapPinnedIcon },
    { name: "营销活动", url: "/marketing", icon: BadgePercentIcon },
    { name: "优惠券", url: "/coupons", icon: TicketPercentIcon },
    { name: "售后审核", url: "/after-sales", icon: ClipboardCheckIcon },
    { name: "通知中心", url: "/notifications", icon: BellIcon },
  ],
}

/**
 * 后台主侧边栏。
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard">
                <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
                  菜
                </span>
                <span className="text-base font-semibold">社区买菜后台</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="快速新建"
              className="min-w-8 bg-emerald-600 text-white duration-200 ease-linear hover:bg-emerald-700 hover:text-white active:bg-emerald-700 active:text-white"
            >
              <PlusCircleIcon />
              <span>快速新建</span>
            </SidebarMenuButton>
            <Button size="sm" className="h-9 shrink-0 group-data-[collapsible=icon]:opacity-0" variant="outline">
              导入
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={pathname === item.url}
                className={cn(pathname === item.url && "bg-emerald-50 text-emerald-700")}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

"use client"

import { FormEvent, useEffect, useState } from "react"
import type { Community } from "@community-grocery/types"
import { toast } from "sonner"
import { Plus, RefreshCw, Search } from "lucide-react"

import { EmptyState, PageShell } from "@/components/admin/page-shell"
import { EnabledBadge } from "@/components/admin/status-pill"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminApi } from "@/lib/admin-api"

type CommunityFormState = {
  id?: string
  name: string
  address: string
  enabled: string
}

const initialForm: CommunityFormState = { name: "", address: "", enabled: "true" }

export default function CommunitiesPage() {
  const [keyword, setKeyword] = useState("")
  const [communities, setCommunities] = useState<Community[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CommunityFormState>(initialForm)

  async function load() {
    try {
      const page = await adminApi.getCommunityPage({ keyword, pageSize: 50 })
      setCommunities(page.list)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "小区加载失败")
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function edit(community: Community) {
    setForm({
      id: community.id,
      name: community.name,
      address: community.address,
      enabled: String(community.enabled),
    })
    setOpen(true)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = { name: form.name, address: form.address, enabled: form.enabled === "true" }
    try {
      if (form.id) {
        await adminApi.updateCommunity(form.id, body)
        toast.success("小区已更新")
      } else {
        await adminApi.createCommunity(body)
        toast.success("小区已创建")
      }
      setOpen(false)
      setForm(initialForm)
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败")
    }
  }

  async function remove(community: Community) {
    if (!window.confirm(`确认删除小区「${community.name}」？`)) return
    await adminApi.deleteCommunity(community.id)
    toast.success("小区已删除")
    await load()
  }

  return (
    <PageShell
      title="小区管理"
      description="维护用户可选择的小区，是订单履约和自提点的基础。"
      action={
        <Button onClick={() => { setForm(initialForm); setOpen(true) }}>
          <Plus className="mr-2 size-4" />
          新增小区
        </Button>
      }
    >
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="搜索小区名称" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </div>
          <Button variant="outline" onClick={load}>
            <RefreshCw className="mr-2 size-4" />
            查询
          </Button>
        </CardContent>
      </Card>

      {communities.length === 0 ? (
        <EmptyState title="暂无小区" description="先创建小区，再配置自提点。" />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>小区名称</TableHead>
                <TableHead>地址</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communities.map((community) => (
                <TableRow key={community.id}>
                  <TableCell className="font-medium">{community.name}</TableCell>
                  <TableCell>{community.address}</TableCell>
                  <TableCell><EnabledBadge enabled={community.enabled} /></TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" onClick={() => edit(community)}>编辑</Button>
                    <Button variant="destructive" size="sm" onClick={() => void remove(community)}>删除</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{form.id ? "编辑小区" : "新增小区"}</SheetTitle>
            <SheetDescription>小区名称建议和用户熟悉的物业/地图名称保持一致。</SheetDescription>
          </SheetHeader>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label>小区名称</Label>
              <Input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>详细地址</Label>
              <Input required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={form.enabled} onValueChange={(enabled) => setForm({ ...form, enabled })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">启用</SelectItem>
                  <SelectItem value="false">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" type="submit">保存小区</Button>
          </form>
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}

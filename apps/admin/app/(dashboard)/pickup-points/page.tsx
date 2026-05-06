"use client"

import { FormEvent, useEffect, useState } from "react"
import type { Community, PickupPoint } from "@community-grocery/types"
import { toast } from "sonner"
import { Plus, RefreshCw } from "lucide-react"

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

type PickupPointFormState = {
  id?: string
  communityId: string
  name: string
  address: string
  contactName: string
  contactPhone: string
  pickupTimeRange: string
  servicePhone: string
  serviceTimeRange: string
  enabled: string
}

const initialForm: PickupPointFormState = {
  communityId: "",
  name: "",
  address: "",
  contactName: "",
  contactPhone: "",
  pickupTimeRange: "今日 18:30 前可自提",
  servicePhone: "",
  serviceTimeRange: "08:00-22:00",
  enabled: "true",
}

const pickupPointFields: Array<{
  key: keyof Pick<
    PickupPointFormState,
    "name" | "address" | "contactName" | "contactPhone" | "pickupTimeRange" | "servicePhone" | "serviceTimeRange"
  >
  label: string
  required?: boolean
}> = [
  { key: "name", label: "自提点名称", required: true },
  { key: "address", label: "自提点地址", required: true },
  { key: "contactName", label: "联系人", required: true },
  { key: "contactPhone", label: "联系电话", required: true },
  { key: "pickupTimeRange", label: "自提时间", required: true },
  { key: "servicePhone", label: "客服电话" },
  { key: "serviceTimeRange", label: "服务时间" },
]

export default function PickupPointsPage() {
  const [communityId, setCommunityId] = useState("all")
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<PickupPointFormState>(initialForm)

  async function load() {
    try {
      const [pickupPage, communityPage] = await Promise.all([
        adminApi.getPickupPointPage({ communityId: communityId === "all" ? undefined : communityId, pageSize: 50 }),
        adminApi.getCommunityPage({ pageSize: 100 }),
      ])
      setPickupPoints(pickupPage.list as PickupPoint[])
      setCommunities(communityPage.list)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "自提点加载失败")
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function edit(point: PickupPoint) {
    setForm({
      id: point.id,
      communityId: point.communityId,
      name: point.name,
      address: point.address,
      contactName: point.contactName,
      contactPhone: point.contactPhone,
      pickupTimeRange: point.pickupTimeRange,
      servicePhone: point.servicePhone ?? "",
      serviceTimeRange: point.serviceTimeRange ?? "",
      enabled: String(point.enabled),
    })
    setOpen(true)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = {
      communityId: form.communityId,
      name: form.name,
      address: form.address,
      contactName: form.contactName,
      contactPhone: form.contactPhone,
      pickupTimeRange: form.pickupTimeRange,
      servicePhone: form.servicePhone || undefined,
      serviceTimeRange: form.serviceTimeRange || undefined,
      enabled: form.enabled === "true",
    }
    try {
      if (form.id) {
        await adminApi.updatePickupPoint(form.id, body)
        toast.success("自提点已更新")
      } else {
        await adminApi.createPickupPoint(body)
        toast.success("自提点已创建")
      }
      setOpen(false)
      setForm(initialForm)
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败")
    }
  }

  async function remove(point: PickupPoint) {
    if (!window.confirm(`确认删除自提点「${point.name}」？`)) return
    await adminApi.deletePickupPoint(point.id)
    toast.success("自提点已删除")
    await load()
  }

  return (
    <PageShell
      title="自提点管理"
      description="维护每个小区的团长、自提地址和服务时间。"
      action={
        <Button onClick={() => { setForm({ ...initialForm, communityId: communities[0]?.id ?? "" }); setOpen(true) }}>
          <Plus className="mr-2 size-4" />
          新增自提点
        </Button>
      }
    >
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row">
          <Select value={communityId} onValueChange={setCommunityId}>
            <SelectTrigger className="w-full md:w-64"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部小区</SelectItem>
              {communities.map((community) => (
                <SelectItem key={community.id} value={community.id}>{community.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={load}>
            <RefreshCw className="mr-2 size-4" />
            查询
          </Button>
        </CardContent>
      </Card>

      {pickupPoints.length === 0 ? (
        <EmptyState title="暂无自提点" description="自提点会影响下单履约和用户取货体验。" />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>自提点</TableHead>
                <TableHead>所属小区</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>自提时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickupPoints.map((point) => (
                <TableRow key={point.id}>
                  <TableCell>
                    <div className="font-medium">{point.name}</div>
                    <div className="text-xs text-muted-foreground">{point.address}</div>
                  </TableCell>
                  <TableCell>{communities.find((item) => item.id === point.communityId)?.name ?? "-"}</TableCell>
                  <TableCell>{point.contactName} / {point.contactPhone}</TableCell>
                  <TableCell>{point.pickupTimeRange}</TableCell>
                  <TableCell><EnabledBadge enabled={point.enabled} /></TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" onClick={() => edit(point)}>编辑</Button>
                    <Button variant="destructive" size="sm" onClick={() => void remove(point)}>删除</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{form.id ? "编辑自提点" : "新增自提点"}</SheetTitle>
            <SheetDescription>建议填写准确的自提地址和团长联系方式，减少取货咨询成本。</SheetDescription>
          </SheetHeader>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label>所属小区</Label>
              <Select value={form.communityId} onValueChange={(value) => setForm({ ...form, communityId: value })}>
                <SelectTrigger><SelectValue placeholder="选择小区" /></SelectTrigger>
                <SelectContent>
                  {communities.map((community) => (
                    <SelectItem key={community.id} value={community.id}>{community.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {pickupPointFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  required={field.required}
                  value={form[field.key]}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                />
              </div>
            ))}
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
            <Button className="w-full" type="submit">保存自提点</Button>
          </form>
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}

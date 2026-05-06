"use client"

import { FormEvent, useEffect, useState } from "react"
import type { Category } from "@community-grocery/types"
import { toast } from "sonner"
import { Plus, RefreshCw, Search } from "lucide-react"

import { EmptyState, PageShell } from "@/components/admin/page-shell"
import { EnabledBadge } from "@/components/admin/status-pill"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminApi } from "@/lib/admin-api"

type CategoryFormState = {
  id?: string
  name: string
  parentId: string
  level: string
  iconUrl: string
  sort: string
  enabled: string
}

const initialForm: CategoryFormState = {
  name: "",
  parentId: "none",
  level: "1",
  iconUrl: "",
  sort: "0",
  enabled: "true",
}

export default function CategoriesPage() {
  const [keyword, setKeyword] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CategoryFormState>(initialForm)

  async function load() {
    setLoading(true)
    try {
      const page = await adminApi.getCategoryPage({ keyword, pageSize: 50 })
      setCategories(page.list)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "分类加载失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function edit(category: Category) {
    setForm({
      id: category.id,
      name: category.name,
      parentId: category.parentId ?? "none",
      level: String(category.level),
      iconUrl: category.iconUrl ?? "",
      sort: String(category.sort),
      enabled: String(category.enabled),
    })
    setOpen(true)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = {
      name: form.name,
      parentId: form.parentId === "none" ? null : form.parentId,
      level: Number(form.level) as Category["level"],
      iconUrl: form.iconUrl || undefined,
      sort: Number(form.sort || 0),
      enabled: form.enabled === "true",
    }
    try {
      if (form.id) {
        await adminApi.updateCategory(form.id, body)
        toast.success("分类已更新")
      } else {
        await adminApi.createCategory(body)
        toast.success("分类已创建")
      }
      setOpen(false)
      setForm(initialForm)
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败")
    }
  }

  async function remove(category: Category) {
    if (!window.confirm(`确认删除分类「${category.name}」？`)) return
    await adminApi.deleteCategory(category.id)
    toast.success("分类已删除")
    await load()
  }

  return (
    <PageShell
      title="分类管理"
      description="维护小程序分类导航，支持父子级分类和排序。"
      action={
        <Button onClick={() => { setForm(initialForm); setOpen(true) }}>
          <Plus className="mr-2 size-4" />
          新增分类
        </Button>
      }
    >
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="搜索分类名称" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className="mr-2 size-4" />
            查询
          </Button>
        </CardContent>
      </Card>

      {categories.length === 0 ? (
        <EmptyState title="暂无分类" description="分类会展示在小程序首页和分类页。" />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>分类名称</TableHead>
                <TableHead>层级</TableHead>
                <TableHead>父级</TableHead>
                <TableHead>排序</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.level} 级</TableCell>
                  <TableCell>{categories.find((item) => item.id === category.parentId)?.name ?? "-"}</TableCell>
                  <TableCell>{category.sort}</TableCell>
                  <TableCell><EnabledBadge enabled={category.enabled} /></TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" onClick={() => edit(category)}>编辑</Button>
                    <Button variant="destructive" size="sm" onClick={() => void remove(category)}>删除</Button>
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
            <SheetTitle>{form.id ? "编辑分类" : "新增分类"}</SheetTitle>
            <SheetDescription>分类结构建议保持 1-2 级，便于小程序用户快速选择。</SheetDescription>
          </SheetHeader>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label>分类名称</Label>
              <Input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>层级</Label>
                <Select value={form.level} onValueChange={(level) => setForm({ ...form, level })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">一级</SelectItem>
                    <SelectItem value="2">二级</SelectItem>
                    <SelectItem value="3">三级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>排序</Label>
                <Input type="number" value={form.sort} onChange={(event) => setForm({ ...form, sort: event.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>父级分类</Label>
              <Select value={form.parentId} onValueChange={(parentId) => setForm({ ...form, parentId })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无父级</SelectItem>
                  {categories.filter((item) => item.id !== form.id).map((item) => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>图标地址</Label>
              <Input value={form.iconUrl} onChange={(event) => setForm({ ...form, iconUrl: event.target.value })} />
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
            <Button className="w-full" type="submit">保存分类</Button>
          </form>
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}

"use client"

import { FormEvent, useEffect, useState } from "react"
import type { Category, Product } from "@community-grocery/types"
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

type ProductFormState = {
  id?: string
  categoryId: string
  name: string
  subtitle: string
  imageUrl: string
  price: string
  marketPrice: string
  stock: string
  unit: string
  enabled: string
}

const initialForm: ProductFormState = {
  categoryId: "",
  name: "",
  subtitle: "",
  imageUrl: "",
  price: "0",
  marketPrice: "",
  stock: "0",
  unit: "份",
  enabled: "true",
}

export default function ProductsPage() {
  const [keyword, setKeyword] = useState("")
  const [categoryId, setCategoryId] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ProductFormState>(initialForm)

  async function load() {
    setLoading(true)
    try {
      const [productPage, categoryPage] = await Promise.all([
        adminApi.getAdminProducts({ keyword, categoryId: categoryId === "all" ? undefined : categoryId, pageSize: 50 }),
        adminApi.getCategoryPage({ pageSize: 100 }),
      ])
      setProducts(productPage.list)
      setCategories(categoryPage.list)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "商品加载失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function edit(product: Product) {
    const sku = product.skus[0]
    setForm({
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      subtitle: product.subtitle ?? "",
      imageUrl: product.imageUrl,
      price: String(sku?.price ?? 0),
      marketPrice: String(sku?.marketPrice ?? ""),
      stock: String(sku?.stock ?? 0),
      unit: sku?.unit ?? "份",
      enabled: String(product.enabled),
    })
    setOpen(true)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = {
      categoryId: form.categoryId,
      name: form.name,
      subtitle: form.subtitle || undefined,
      imageUrl: form.imageUrl,
      enabled: form.enabled === "true",
      skus: [
        {
          id: form.id ? products.find((item) => item.id === form.id)?.skus[0]?.id : undefined,
          name: form.name,
          unit: form.unit,
          price: Number(form.price),
          marketPrice: form.marketPrice ? Number(form.marketPrice) : undefined,
          stock: Number(form.stock),
          enabled: true,
        },
      ],
    }
    try {
      if (form.id) {
        await adminApi.updateProduct(form.id, body)
        toast.success("商品已更新")
      } else {
        await adminApi.createProduct(body)
        toast.success("商品已创建")
      }
      setOpen(false)
      setForm(initialForm)
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败")
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`确认删除商品「${product.name}」？`)) return
    await adminApi.deleteProduct(product.id)
    toast.success("商品已删除")
    await load()
  }

  return (
    <PageShell
      title="商品管理"
      description="维护商品资料、基础 SKU、价格和上下架状态。"
      action={
        <Button onClick={() => { setForm({ ...initialForm, categoryId: categories[0]?.id ?? "" }); setOpen(true) }}>
          <Plus className="mr-2 size-4" />
          新增商品
        </Button>
      }
    >
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="搜索商品名称" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </div>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className="mr-2 size-4" />
            查询
          </Button>
        </CardContent>
      </Card>

      {products.length === 0 ? (
        <EmptyState title="暂无商品" description="新增商品后会进入小程序商品列表。" />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>库存</TableHead>
                <TableHead>销量</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.subtitle ?? "暂无副标题"}</div>
                  </TableCell>
                  <TableCell>{categories.find((item) => item.id === product.categoryId)?.name ?? "-"}</TableCell>
                  <TableCell className="font-semibold text-red-500">¥{product.skus[0]?.price ?? "-"}</TableCell>
                  <TableCell>{product.skus.reduce((sum, sku) => sum + sku.stock, 0)}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell><EnabledBadge enabled={product.enabled} /></TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="outline" size="sm" onClick={() => edit(product)}>编辑</Button>
                    <Button variant="destructive" size="sm" onClick={() => void remove(product)}>删除</Button>
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
            <SheetTitle>{form.id ? "编辑商品" : "新增商品"}</SheetTitle>
            <SheetDescription>第一阶段先维护一个基础 SKU，后续可以扩展多规格。</SheetDescription>
          </SheetHeader>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label>商品分类</Label>
              <Select value={form.categoryId} onValueChange={(value) => setForm({ ...form, categoryId: value })}>
                <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>商品名称</Label>
              <Input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>副标题</Label>
              <Input value={form.subtitle} onChange={(event) => setForm({ ...form, subtitle: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>商品图片 URL</Label>
              <Input required value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>售价</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>划线价</Label>
                <Input type="number" step="0.01" value={form.marketPrice} onChange={(event) => setForm({ ...form, marketPrice: event.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>库存</Label>
                <Input type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>单位</Label>
                <Input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={form.enabled} onValueChange={(enabled) => setForm({ ...form, enabled })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">上架</SelectItem>
                  <SelectItem value="false">下架</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" type="submit">保存商品</Button>
          </form>
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}

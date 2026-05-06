"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adminApi, setAdminToken } from "@/lib/admin-api"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    try {
      const result = await adminApi.adminLogin({ username, password })
      setAdminToken(result.accessToken)
      toast.success("登录成功")
      router.replace("/dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7,transparent_35%),linear-gradient(135deg,#f8fafc,#ecfdf5)] p-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border bg-white/85 shadow-2xl backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden bg-emerald-600 p-10 text-white lg:block">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold">菜</div>
            <h1 className="mt-10 text-4xl font-semibold tracking-tight">社区买菜运营后台</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-emerald-50">
              商品、库存、订单、自提点和营销活动集中管理，让社区履约更稳、更快、更清楚。
            </p>
            <div className="mt-10 grid grid-cols-3 gap-3 text-center">
              {["商品", "订单", "履约"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm">{item}</div>
              ))}
            </div>
          </section>
          <section className="flex items-center justify-center p-6 md:p-12">
            <Card className="w-full max-w-md border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">管理员登录</CardTitle>
                <CardDescription>使用种子数据管理员账号进入后台。</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={submit}>
                  <div className="space-y-2">
                    <Label>账号</Label>
                    <Input value={username} onChange={(event) => setUsername(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>密码</Label>
                    <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading ? "登录中..." : "登录后台"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}

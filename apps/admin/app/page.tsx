import { StatusBadge } from "@community-grocery/admin-ui";
import { ORDER_STATUS_LABEL } from "@community-grocery/constants";

const metrics = [
  { label: "今日订单", value: "128" },
  { label: "待自提", value: "36" },
  { label: "在售商品", value: "246" },
  { label: "小区数量", value: "18" },
];

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">社区买菜后台</h1>
            <p className="mt-1 text-sm text-slate-500">商品、订单、小区和自提点运营管理</p>
          </div>
          <StatusBadge>{ORDER_STATUS_LABEL.pendingPickup}</StatusBadge>
        </header>

        <section className="grid grid-cols-4 gap-4">
          {metrics.map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">{item.label}</div>
              <div className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

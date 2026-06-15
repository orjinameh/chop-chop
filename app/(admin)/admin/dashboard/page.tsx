import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, TrendingUp, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_MAP } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard | Admin" };
// No cache — always fresh
export const dynamic = "force-dynamic";

// Define the shape of the order based on your Prisma query and UI needs
interface DashboardOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: Date;
  items: { name: string; quantity: number }[];
}

async function getDashboardData() {
  const [
    totalOrders,
    paidOrders,
    pendingOrders,
    recentOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { items: { select: { name: true, quantity: true } } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);

  return {
    totalOrders,
    paidOrders,
    pendingOrders,
    recentOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
  };
}

export default async function DashboardPage() {
  const { totalOrders, paidOrders, pendingOrders, recentOrders, totalRevenue } =
    await getDashboardData();

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: paidOrders,
      icon: CheckCircle2,
      color: "text-brand-500",
      bg: "bg-brand-50",
    },
    {
      label: "Pending",
      value: pendingOrders,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-ink mb-1">Dashboard</h1>
      <p className="text-sm text-ink-muted mb-8">Overview of your business</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex flex-col gap-3">
            <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-ink-muted">{label}</p>
              <p className="text-xl font-bold text-ink mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-faint bg-surface-muted">
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden sm:table-cell">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-faint bg-white">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-ink-muted">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  // Apply the DashboardOrder type here
                  recentOrders.map((order: DashboardOrder) => {
                    const statusInfo = ORDER_STATUS_MAP[order.status] ?? {
                      label: order.status,
                      color: "bg-gray-100 text-gray-700",
                    };
                    return (
                      <tr key={order.id} className="hover:bg-surface-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-ink">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="hover:text-brand-500 transition-colors"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-ink-muted">{order.customerName}</td>
                        <td className="px-4 py-3 text-ink-muted hidden sm:table-cell">
                          {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ").slice(0, 40)}
                          {order.items.length > 1 ? "…" : ""}
                        </td>
                        <td className="px-4 py-3 font-medium text-ink">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-muted hidden md:table-cell">
                          {new Date(order.createdAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
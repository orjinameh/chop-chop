import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_MAP } from "@/lib/utils";
import { OrderStatusFilter } from "@/components/admin/order-status-filter";

export const metadata: Metadata = { title: "Orders | Admin" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where:   status && status !== "ALL" ? { status: status as any } : {},
    orderBy: { createdAt: "desc" },
    include: { items: { select: { name: true, quantity: true } } },
  });

  const statusOptions = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Orders</h1>
          <p className="text-sm text-ink-muted mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <OrderStatusFilter current={status ?? "ALL"} options={statusOptions} />

      {/* Orders table */}
      <div className="card overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-faint bg-surface-muted">
                {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-faint bg-white">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-ink-muted">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusInfo = ORDER_STATUS_MAP[order.status] ?? {
                    label: order.status,
                    color: "bg-gray-100 text-gray-700",
                  };
                  return (
                    <tr key={order.id} className="hover:bg-surface-muted/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-ink font-medium">{order.customerName}</p>
                        <p className="text-xs text-ink-muted">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-ink-muted max-w-[180px] truncate">
                        {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                      </td>
                      <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge ${
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.paymentStatus === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-muted whitespace-nowrap text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-brand-500 hover:text-brand-600 font-medium text-xs whitespace-nowrap"
                        >
                          View →
                        </Link>
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
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_MAP } from "@/lib/utils";
import { UpdateOrderStatus } from "@/components/admin/update-order-status";

export const metadata: Metadata = { title: "Order Detail | Admin" };
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where:   { id },
    include: { items: true },
  });

  if (!order) notFound();

  const statusInfo = ORDER_STATUS_MAP[order.status] ?? {
    label: order.status,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink">{order.orderNumber}</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Placed {new Date(order.createdAt).toLocaleString("en-NG")}
          </p>
        </div>
        <span className={`badge text-sm px-3 py-1 ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Customer details */}
        <div className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            Customer
          </h2>
          <p className="font-medium text-ink">{order.customerName}</p>
          <p className="text-sm text-ink-muted mt-1">{order.customerEmail}</p>
          <p className="text-sm text-ink-muted">{order.customerPhone}</p>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">
            {order.deliveryAddress}
          </p>
          {order.notes && (
            <p className="text-sm text-ink mt-3 italic border-t border-ink-faint pt-3">
              Note: {order.notes}
            </p>
          )}
        </div>

        {/* Payment */}
        <div className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            Payment
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Status</span>
              <span
                className={`badge ${
                  order.paymentStatus === "PAID"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            {order.paystackRef && (
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Paystack Ref</span>
                <span className="font-mono text-xs text-ink">{order.paystackRef}</span>
              </div>
            )}
            <div className="border-t border-ink-faint pt-2 mt-1 flex flex-col gap-1">
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Delivery</span><span>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-ink mt-1">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="card overflow-hidden mt-5">
        <div className="px-5 py-3 border-b border-ink-faint bg-surface-muted">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Items
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-faint text-xs text-ink-muted">
              <th className="px-5 py-2.5 text-left">Item</th>
              <th className="px-5 py-2.5 text-center">Qty</th>
              <th className="px-5 py-2.5 text-right">Unit</th>
              <th className="px-5 py-2.5 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-faint bg-white">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3 font-medium text-ink">{item.name}</td>
                <td className="px-5 py-3 text-center text-ink-muted">{item.quantity}</td>
                <td className="px-5 py-3 text-right text-ink-muted">{formatPrice(item.price)}</td>
                <td className="px-5 py-3 text-right font-semibold text-ink">{formatPrice(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status updater */}
      <div className="card p-5 mt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-4">
          Update Order Status
        </h2>
        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}

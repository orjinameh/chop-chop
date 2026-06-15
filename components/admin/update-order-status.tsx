"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ORDER_STATUS_MAP } from "@/lib/utils";
import { updateOrderStatusAction } from "@/lib/actions";

const STATUS_FLOW = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

interface UpdateOrderStatusProps {
  orderId:       string;
  currentStatus: string;
}

export function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(currentStatus);

  function handleUpdate() {
    if (selected === currentStatus) return;
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, selected);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Order status updated");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="h-10 flex-1 rounded border border-ink-faint bg-white px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        {STATUS_FLOW.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_MAP[s]?.label ?? s}
          </option>
        ))}
        <option value="CANCELLED">Cancelled</option>
      </select>

      <Button
        onClick={handleUpdate}
        disabled={isPending || selected === currentStatus}
        className="gap-2"
      >
        {isPending ? <><Spinner size="sm" /> Updating…</> : "Update Status"}
      </Button>
    </div>
  );
}

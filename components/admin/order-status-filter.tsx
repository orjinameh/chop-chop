"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  ALL:              "All",
  PENDING:          "Pending",
  CONFIRMED:        "Confirmed",
  PREPARING:        "Preparing",
  READY:            "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED:        "Delivered",
  CANCELLED:        "Cancelled",
};

interface OrderStatusFilterProps {
  current: string;
  options: string[];
}

export function OrderStatusFilter({ current, options }: OrderStatusFilterProps) {
  const router   = useRouter();
  const pathname = usePathname();

  function navigate(status: string) {
    const sp = new URLSearchParams();
    if (status !== "ALL") sp.set("status", status);
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => navigate(opt)}
          className={cn(
            "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
            current === opt
              ? "bg-brand-500 text-white border-brand-500"
              : "bg-white text-ink-muted border-ink-faint hover:border-brand-300 hover:text-ink"
          )}
        >
          {LABELS[opt] ?? opt}
        </button>
      ))}
    </div>
  );
}

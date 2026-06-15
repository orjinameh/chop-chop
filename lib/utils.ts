import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Nigerian Naira */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Generate a unique order number like CC-20240614-4A2B */
export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CC-${date}-${rand}`;
}

/** Slugify a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Capitalise first letter of each word */
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Order status label + colour */
export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  PENDING:          { label: "Pending",           color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED:        { label: "Confirmed",          color: "bg-blue-100 text-blue-800" },
  PREPARING:        { label: "Preparing",          color: "bg-purple-100 text-purple-800" },
  READY:            { label: "Ready for pickup",   color: "bg-green-100 text-green-800" },
  OUT_FOR_DELIVERY: { label: "Out for delivery",   color: "bg-indigo-100 text-indigo-800" },
  DELIVERED:        { label: "Delivered",          color: "bg-emerald-100 text-emerald-800" },
  CANCELLED:        { label: "Cancelled",          color: "bg-red-100 text-red-800" },
};

/** Delivery fee in kobo (for display) */
export const DELIVERY_FEE = 500; // ₦500

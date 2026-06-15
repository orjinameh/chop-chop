"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, DELIVERY_FEE } from "@/lib/utils";
import type { CheckoutFormData } from "@/types";

// Extend Window type to hold PaystackPop
declare global {
  interface Window {
    PaystackPop: {
      setup: (opts: PaystackOptions) => { openIframe: () => void };
    };
  }
}

interface PaystackOptions {
  key:       string;
  email:     string;
  amount:    number; // in kobo
  currency:  string;
  ref:       string;
  metadata:  Record<string, unknown>;
  callback:  (response: { reference: string }) => void;
  onClose:   () => void;
}

export function CheckoutForm() {
  const router   = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const subtotal = totalPrice();
  const total    = subtotal + DELIVERY_FEE;

  const [form, setForm] = useState<CheckoutFormData>({
    name:    "",
    email:   "",
    phone:   "",
    address: "",
    notes:   "",
  });
  const [errors,  setErrors]  = useState<Partial<CheckoutFormData>>({});
  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-muted mb-4">Your cart is empty.</p>
        <Button asChild><Link href="/menu">Go to Menu</Link></Button>
      </div>
    );
  }

  function validate(): boolean {
    const e: Partial<CheckoutFormData> = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim())   e.phone   = "Phone number is required";
    if (!form.address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // 1. Create a pending order on the server and get a Paystack ref
      const res = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, items, subtotal, total }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to create order");

      const { paystackRef, orderId } = data;

      // 2. Load Paystack inline script and open popup
      await loadPaystackScript();

      const handler = window.PaystackPop.setup({
        key:      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email:    form.email,
        amount:   total * 100, // kobo
        currency: "NGN",
        ref:      paystackRef,
        metadata: { orderId, customerName: form.name },

        callback(response) {
          // 3. Verify payment server-side
          verifyAndComplete(response.reference, orderId);
        },
        onClose() {
          toast.error("Payment cancelled. Your order is saved — you can retry.");
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  async function verifyAndComplete(reference: string, orderId: string) {
    try {
      const res = await fetch("/api/checkout/verify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      clearCart();
      router.push(`/order-success?order=${data.orderNumber}`);
    } catch (err: any) {
      toast.error("Payment verification failed. Contact support.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* ── Delivery details (3 cols) ───────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-4">Delivery Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                placeholder="Chidi Okeke"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="chidi@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={errors.phone}
                className="sm:col-span-2"
              />
              <Textarea
                label="Delivery Address"
                placeholder="12 Bode Thomas Street, Surulere, Lagos"
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                error={errors.address}
                className="sm:col-span-2"
              />
              <Textarea
                label="Order Notes (optional)"
                placeholder="Allergies, gate codes, landmarks…"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="sm:col-span-2"
              />
            </div>
          </div>
        </div>

        {/* ── Order summary (2 cols) ─────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="card p-5 flex flex-col gap-3 sticky top-20">
            <h2 className="font-semibold text-ink">Order Summary</h2>

            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-ink-muted line-clamp-1 flex-1 pr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-ink font-medium flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-faint pt-3 flex flex-col gap-1.5">
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Delivery</span>
                <span>{formatPrice(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between font-bold text-ink mt-1">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2 gap-2"
              disabled={loading}
            >
              {loading ? (
                <><Spinner size="sm" /> Processing…</>
              ) : (
                `Pay ${formatPrice(total)} via Paystack`
              )}
            </Button>

            <p className="text-xs text-center text-ink-muted">
              🔒 Secured by Paystack · Card, bank transfer, USSD
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

/** Dynamically load Paystack inline JS (only once) */
function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const s = document.createElement("script");
    s.src   = "https://js.paystack.co/v1/inline.js";
    s.onload  = () => resolve();
    s.onerror = () => reject(new Error("Could not load Paystack script"));
    document.head.appendChild(s);
  });
}

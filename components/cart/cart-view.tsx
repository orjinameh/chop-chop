"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatPrice, DELIVERY_FEE } from "@/lib/utils";

export function CartView() {
  const { items, removeItem, updateQty, totalPrice } = useCart();
  const subtotal = totalPrice();
  const total    = subtotal + DELIVERY_FEE;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-ink-faint" />
        <h2 className="text-lg font-semibold text-ink">Your cart is empty</h2>
        <p className="text-sm text-ink-muted">Add some delicious items from our menu</p>
        <Button asChild>
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Line items */}
      <div className="flex-1 flex flex-col divide-y divide-ink-faint border border-ink-faint rounded-lg overflow-hidden">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white p-4">
            {/* Image */}
            <div className="relative h-16 w-16 rounded overflow-hidden bg-surface-muted flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
              )}
            </div>

            {/* Name + price */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink text-sm leading-snug line-clamp-1">
                {item.name}
              </p>
              <p className="text-sm text-ink-muted mt-0.5">
                {formatPrice(item.price)} each
              </p>
            </div>

            {/* Qty controls */}
            <div className="flex items-center border border-ink-faint rounded">
              <button
                onClick={() => updateQty(item.id, item.quantity - 1)}
                className="px-2.5 py-1.5 text-ink-muted hover:text-ink hover:bg-surface-muted"
                aria-label="Decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQty(item.id, item.quantity + 1)}
                className="px-2.5 py-1.5 text-ink-muted hover:text-ink hover:bg-surface-muted"
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Subtotal */}
            <span className="w-20 text-right text-sm font-semibold text-ink">
              {formatPrice(item.price * item.quantity)}
            </span>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.id)}
              className="text-ink-muted hover:text-red-500 transition-colors ml-1"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="lg:w-72 flex-shrink-0">
        <div className="card p-5 flex flex-col gap-3">
          <h2 className="font-semibold text-ink">Order Summary</h2>

          <div className="flex justify-between text-sm text-ink-muted">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-muted">
            <span>Delivery fee</span>
            <span>{formatPrice(DELIVERY_FEE)}</span>
          </div>

          <div className="border-t border-ink-faint pt-3 flex justify-between font-bold text-ink">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button asChild size="lg" className="w-full mt-1">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>

          <Link
            href="/menu"
            className="text-center text-sm text-ink-muted hover:text-brand-500 transition-colors"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

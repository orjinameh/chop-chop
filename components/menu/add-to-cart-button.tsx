"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "@/types";

interface AddToCartButtonProps {
  item: MenuItem;
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({
        id:    item.id,
        name:  item.name,
        price: item.price,
        image: item.image,
        slug:  item.slug,
      });
    }
    toast.success(`${qty}× ${item.name} added to cart`);
  }

  if (!item.isAvailable) {
    return (
      <Button disabled size="lg" className="w-full sm:w-auto">
        Unavailable
      </Button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Quantity selector */}
      <div className="flex items-center border border-ink-faint rounded h-12">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 h-full text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-sm font-semibold text-ink">
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="px-3 h-full text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to cart */}
      <Button size="lg" onClick={handleAdd} className="flex-1 sm:flex-none gap-2">
        <ShoppingCart className="h-5 w-5" />
        Add to cart
      </Button>
    </div>
  );
}

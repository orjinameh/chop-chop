"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface MenuCardProps {
  item: MenuItem & { category?: { name: string } };
}

export function MenuCard({ item }: MenuCardProps) {
  const addItem = useCart((s) => s.addItem);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate when clicking the card link
    addItem({
      id:    item.id,
      name:  item.name,
      price: item.price,
      image: item.image,
      slug:  item.slug,
    });
    toast.success(`${item.name} added to cart`);
  }

  return (
    <Link
      href={`/menu/${item.slug}`}
      className="card group flex flex-col overflow-hidden hover:border-brand-300 transition-colors"
    >
      {/* Image */}
      <div className="relative h-44 w-full bg-surface-muted overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            🍽️
          </div>
        )}

        {/* Category pill */}
        {item.category && (
          <span className="absolute top-2 left-2 badge bg-white/90 text-ink text-xs shadow-sm">
            {item.category.name}
          </span>
        )}

        {/* Unavailable overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-ink text-white">Unavailable</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3 gap-2">
        <h3 className="font-semibold text-sm text-ink leading-snug line-clamp-1">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-ink-muted line-clamp-2 flex-1">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-ink">{formatPrice(item.price)}</span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!item.isAvailable}
            className="h-8 gap-1.5"
            aria-label={`Add ${item.name} to cart`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}

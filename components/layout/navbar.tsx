"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/",       label: "Home"  },
  { href: "/menu",   label: "Menu"  },
];

export function Navbar() {
  const pathname   = usePathname();
  const totalItems = useCart((s) => s.totalItems());
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-faint bg-white">
      <nav className="container-base flex h-16 items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-ink text-lg"
        >
          <UtensilsCrossed className="h-5 w-5 text-brand-500" />
          Chop Chop
        </Link>

        {/* Desktop nav */}
        <ul className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-500",
                  pathname === l.href ? "text-brand-500" : "text-ink-muted"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium text-ink hover:bg-surface-muted transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden p-2 rounded hover:bg-surface-muted"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-ink-faint bg-white px-4 pb-4 pt-2">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-2.5 text-sm font-medium",
                pathname === l.href ? "text-brand-500" : "text-ink-muted"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

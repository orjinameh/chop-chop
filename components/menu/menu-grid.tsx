"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuCard } from "@/components/menu/menu-card";
import { Spinner } from "@/components/ui/spinner";
import type { MenuItem, Category } from "@/types";

interface MenuGridProps {
  items:           (MenuItem & { category: Category })[];
  categories:      Category[];
  currentCategory: string;
  currentQuery:    string;
}

export function MenuGrid({
  items,
  categories,
  currentCategory,
  currentQuery,
}: MenuGridProps) {
  const router     = useRouter();
  const pathname   = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(currentQuery);

  /** Push a new URL with updated search params */
  function navigate(params: { category?: string; q?: string }) {
    const sp = new URLSearchParams();
    const cat = params.category ?? currentCategory;
    const q   = params.q       ?? query;
    if (cat && cat !== "all") sp.set("category", cat);
    if (q)                     sp.set("q", q);
    startTransition(() => {
      router.push(`${pathname}?${sp.toString()}`);
    });
  }

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      navigate({ q: query });
    },
    [query, currentCategory]
  );

  const clearSearch = () => {
    setQuery("");
    navigate({ q: "" });
  };

  return (
    <div className="mt-8">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search meals…"
          className="h-10 w-full rounded border border-ink-faint bg-white pl-9 pr-10 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Category tabs */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[{ slug: "all", name: "All" }, ...categories].map((cat) => (
          <button
            key={cat.slug}
            onClick={() => navigate({ category: cat.slug })}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
              currentCategory === cat.slug
                ? "bg-brand-500 text-white border-brand-500"
                : "bg-white text-ink-muted border-ink-faint hover:border-brand-300 hover:text-ink"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Pending state */}
      {isPending && (
        <div className="mt-10 flex justify-center">
          <Spinner />
        </div>
      )}

      {/* Items grid */}
      {!isPending && (
        <>
          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-2xl">🍽️</p>
              <p className="mt-2 font-medium text-ink">No items found</p>
              <p className="text-sm text-ink-muted mt-1">
                Try a different category or search term
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

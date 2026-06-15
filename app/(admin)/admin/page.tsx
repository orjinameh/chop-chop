import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DeleteMenuItemButton } from "@/components/admin/delete-menu-item-button";

export const metadata: Metadata = { title: "Menu Management | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Menu</h1>
          <p className="text-sm text-ink-muted mt-0.5">{items.length} items</p>
        </div>
        <Button asChild>
          <Link href="/admin/menu/new" className="gap-2">
            <Plus className="h-4 w-4" /> Add Item
          </Link>
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-faint bg-surface-muted">
                {["", "Name", "Category", "Price", "Available", "Featured", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-faint bg-white">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-ink-muted">
                    No menu items yet.{" "}
                    <Link href="/admin/menu/new" className="text-brand-500 hover:underline">
                      Add one
                    </Link>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-muted/40 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-4 py-3 w-12">
                      <div className="relative h-10 w-10 rounded overflow-hidden bg-surface-muted flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-lg">🍽️</div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{item.name}</p>
                      <p className="text-xs text-ink-muted line-clamp-1 max-w-[200px]">
                        {item.description}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span className="badge bg-surface-muted text-ink-muted">
                        {item.category.name}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">
                      {formatPrice(item.price)}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`badge ${item.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {item.isAvailable ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`badge ${item.isFeatured ? "bg-brand-100 text-brand-700" : "bg-surface-muted text-ink-muted"}`}>
                        {item.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/menu/${item.id}`}
                          className="text-xs font-medium text-brand-500 hover:text-brand-600"
                        >
                          Edit
                        </Link>
                        <DeleteMenuItemButton id={item.id} name={item.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

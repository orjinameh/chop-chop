import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MenuItemForm } from "@/components/admin/menu-item-form";

export const metadata: Metadata = { title: "Add Menu Item | Admin" };

export default async function AdminNewMenuItemPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/menu"
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Menu
      </Link>
      <h1 className="text-2xl font-bold text-ink mb-6">Add Menu Item</h1>
      <MenuItemForm categories={categories} />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MenuItemForm } from "@/components/admin/menu-item-form";

export const metadata: Metadata = { title: "Edit Menu Item | Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditMenuItemPage({ params }: PageProps) {
  const { id } = await params;

  const [item, categories] = await Promise.all([
    prisma.menuItem.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!item) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/menu"
        className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Menu
      </Link>
      <h1 className="text-2xl font-bold text-ink mb-6">Edit: {item.name}</h1>
      <MenuItemForm categories={categories} item={item as any} />
    </div>
  );
}

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MenuGrid } from "@/components/menu/menu-grid";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse our full menu of Nigerian and continental dishes. Rice, soups, fast food, grills and more.",
};

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

async function getMenuData(category?: string, q?: string) {
  const [categories, items] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        ...(category && category !== "all"
          ? { category: { slug: category } }
          : {}),
        ...(q
          ? {
              OR: [
                { name:        { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);
  return { categories, items };
}

export default async function MenuPage({ searchParams }: PageProps) {
  const { category, q } = await searchParams;
  const { categories, items } = await getMenuData(category, q);

  return (
    <div className="section">
      <div className="container-base">
        <h1 className="text-3xl font-bold text-ink">Our Menu</h1>
        <p className="mt-1 text-ink-muted">
          {items.length} item{items.length !== 1 ? "s" : ""} available
        </p>

        {/* Client component handles search input + category tabs + grid */}
        <MenuGrid
          items={items}
          categories={categories}
          currentCategory={category ?? "all"}
          currentQuery={q ?? ""}
        />
      </div>
    </div>
  );
}

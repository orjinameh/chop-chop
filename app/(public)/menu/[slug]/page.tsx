import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/menu/add-to-cart-button";
import { MenuCard } from "@/components/menu/menu-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.menuItem.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!item) return { title: "Not found" };
  return {
    title:       item.name,
    description: item.description ?? `Order ${item.name} from Chop Chop`,
    openGraph: {
      title:       item.name,
      description: item.description ?? "",
      images:      item.image ? [{ url: item.image }] : [],
    },
  };
}

export async function generateStaticParams() {
  const items = await prisma.menuItem.findMany({ select: { slug: true } });
  return items.map((i) => ({ slug: i.slug }));
}

export default async function MenuItemPage({ params }: PageProps) {
  const { slug } = await params;

  const item = await prisma.menuItem.findUnique({
    where:   { slug },
    include: { category: true },
  });

  if (!item) notFound();

  // Related items in same category
  const related = await prisma.menuItem.findMany({
    where: {
      categoryId:  item.categoryId,
      isAvailable: true,
      NOT: { id: item.id },
    },
    include: { category: true },
    take: 4,
  });

  return (
    <div className="section">
      <div className="container-base">
        {/* Item detail */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-surface-muted">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">🍽️</div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {item.category && (
              <span className="badge bg-brand-100 text-brand-700 self-start mb-3">
                {item.category.name}
              </span>
            )}

            <h1 className="text-3xl font-bold text-ink">{item.name}</h1>

            {item.description && (
              <p className="mt-3 text-ink-muted leading-relaxed">{item.description}</p>
            )}

            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-ink">
                {formatPrice(item.price)}
              </span>
              {!item.isAvailable && (
                <span className="badge bg-red-100 text-red-700">Currently unavailable</span>
              )}
            </div>

            <div className="mt-6">
              <AddToCartButton item={item} />
            </div>

            <p className="mt-4 text-xs text-ink-muted">
              ✓ Fresh preparation · ✓ Secure Paystack checkout · ✓ Fast delivery
            </p>
          </div>
        </div>

        {/* Related items */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-ink mb-6">
              More from {item.category?.name}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <MenuCard key={r.id} item={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

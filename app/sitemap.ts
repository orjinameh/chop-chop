import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [items, categories] = await Promise.all([
    prisma.menuItem.findMany({
      where:  { isAvailable: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,           lastModified: new Date(), changeFrequency: "weekly",  priority: 1    },
    { url: `${BASE}/menu`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.9  },
    { url: `${BASE}/cart`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3  },
  ];

  const itemRoutes: MetadataRoute.Sitemap = items.map((item) => ({
    url:             `${BASE}/menu/${item.slug}`,
    lastModified:    item.updatedAt,
    changeFrequency: "weekly",
    priority:        0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url:             `${BASE}/menu?category=${cat.slug}`,
    lastModified:    new Date(),
    changeFrequency: "weekly",
    priority:        0.6,
  }));

  return [...staticRoutes, ...itemRoutes, ...categoryRoutes];
}

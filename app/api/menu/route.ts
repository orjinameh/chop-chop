import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q        = searchParams.get("q");
    const featured = searchParams.get("featured") === "true";

    const items = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        ...(featured ? { isFeatured: true } : {}),
        ...(category ? { category: { slug: category } } : {}),
        ...(q
          ? {
              OR: [
                { name:        { contains: q } },
                { description: { contains: q } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json({ data: items });
  } catch (err) {
    console.error("[MENU GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

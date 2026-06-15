import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit  = Number(searchParams.get("limit") ?? "50");

    const orders = await prisma.order.findMany({
      where:   status ? { status: status as any } : {},
      orderBy: { createdAt: "desc" },
      take:    limit,
      include: { items: true },
    });

    return NextResponse.json({ data: orders });
  } catch (err) {
    console.error("[ORDERS GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

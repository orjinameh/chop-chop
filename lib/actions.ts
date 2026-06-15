"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";

// ─── Guard helper ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorised");
  }
}

// ─── Update order status ──────────────────────────────────────────────────────

export async function updateOrderStatusAction(
  orderId: string,
  status:  string
): Promise<{ error?: string }> {
  try {
    await requireAdmin();

    const valid = [
      "PENDING","CONFIRMED","PREPARING","READY",
      "OUT_FOR_DELIVERY","DELIVERED","CANCELLED",
    ];
    if (!valid.includes(status)) return { error: "Invalid status" };

    await prisma.order.update({
      where: { id: orderId },
      data:  { status: status as any },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/dashboard");
    return {};
  } catch (err: any) {
    return { error: err.message ?? "Failed to update" };
  }
}

// ─── Menu item schema ─────────────────────────────────────────────────────────

const MenuItemSchema = z.object({
  name:        z.string().min(2),
  description: z.string().optional(),
  price:       z.coerce.number().positive(),
  categoryId:  z.string().min(1),
  image:       z.string().url().optional().or(z.literal("")),
  isAvailable: z.coerce.boolean().default(true),
  isFeatured:  z.coerce.boolean().default(false),
});

// ─── Create menu item ─────────────────────────────────────────────────────────

export async function createMenuItemAction(
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await requireAdmin();

    const raw = Object.fromEntries(formData.entries());
    const parsed = MenuItemSchema.safeParse({
      ...raw,
      isAvailable: raw.isAvailable === "on" || raw.isAvailable === "true",
      isFeatured:  raw.isFeatured  === "on" || raw.isFeatured  === "true",
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { name, description, price, categoryId, image, isAvailable, isFeatured } =
      parsed.data;

    // Generate a unique slug
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let i = 1;
    while (await prisma.menuItem.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    await prisma.menuItem.create({
      data: {
        name, description, price, categoryId,
        image:       image || null,
        isAvailable, isFeatured,
        slug,
      },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    revalidatePath("/");
    return {};
  } catch (err: any) {
    return { error: err.message ?? "Failed to create item" };
  }
}

// ─── Update menu item ─────────────────────────────────────────────────────────

export async function updateMenuItemAction(
  id: string,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await requireAdmin();

    const raw = Object.fromEntries(formData.entries());
    const parsed = MenuItemSchema.safeParse({
      ...raw,
      isAvailable: raw.isAvailable === "on" || raw.isAvailable === "true",
      isFeatured:  raw.isFeatured  === "on" || raw.isFeatured  === "true",
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { name, description, price, categoryId, image, isAvailable, isFeatured } =
      parsed.data;

    await prisma.menuItem.update({
      where: { id },
      data: {
        name, description, price, categoryId,
        image:       image || null,
        isAvailable, isFeatured,
      },
    });

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    revalidatePath("/");
    return {};
  } catch (err: any) {
    return { error: err.message ?? "Failed to update item" };
  }
}

// ─── Delete menu item ─────────────────────────────────────────────────────────

export async function deleteMenuItemAction(
  id: string
): Promise<{ error?: string }> {
  try {
    await requireAdmin();

    await prisma.menuItem.delete({ where: { id } });

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    revalidatePath("/");
    return {};
  } catch (err: any) {
    return { error: err.message ?? "Failed to delete item" };
  }
}

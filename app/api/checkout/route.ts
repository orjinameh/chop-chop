import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber, DELIVERY_FEE } from "@/lib/utils";
import { z } from "zod";

// ─── Validation schema ────────────────────────────────────────────────────────

const CheckoutSchema = z.object({
  form: z.object({
    name:    z.string().min(2),
    email:   z.string().email(),
    phone:   z.string().min(7),
    address: z.string().min(5),
    notes:   z.string().optional(),
  }),
  items: z.array(
    z.object({
      id:       z.string(),
      name:     z.string(),
      price:    z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  subtotal: z.number().positive(),
  total:    z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { form, items, subtotal, total } = parsed.data;

    // Re-validate prices server-side to prevent tampering
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: items.map((i) => i.id) } },
    });

    const serverTotal =
      menuItems.reduce((sum, mi) => {
        const cartItem = items.find((i) => i.id === mi.id);
        return sum + mi.price * (cartItem?.quantity ?? 0);
      }, 0) + DELIVERY_FEE;

    // Allow a tiny float tolerance (₦1)
    if (Math.abs(serverTotal - total) > 1) {
      return NextResponse.json(
        { error: "Price mismatch — please refresh and try again." },
        { status: 400 }
      );
    }

    // Generate Paystack reference
    const paystackRef   = `CC-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const orderNumber   = generateOrderNumber();

    // Create pending order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName:    form.name,
        customerEmail:   form.email,
        customerPhone:   form.phone,
        deliveryAddress: form.address,
        notes:           form.notes ?? null,
        subtotal,
        deliveryFee:     DELIVERY_FEE,
        total,
        paystackRef,
        status:          "PENDING",
        paymentStatus:   "PENDING",
        items: {
          create: items.map((i) => {
            const mi = menuItems.find((m) => m.id === i.id)!;
            return {
              menuItemId: i.id,
              name:       mi.name,
              price:      mi.price,
              quantity:   i.quantity,
              subtotal:   mi.price * i.quantity,
            };
          }),
        },
      },
    });

    return NextResponse.json({ paystackRef, orderId: order.id });
  } catch (err) {
    console.error("[CHECKOUT]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

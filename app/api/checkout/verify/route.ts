import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { reference, orderId } = await req.json();

    if (!reference || !orderId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ── Verify with Paystack ────────────────────────────────────────────────
    const psRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const psData = await psRes.json();

    if (!psRes.ok || psData.data?.status !== "success") {
      return NextResponse.json(
        { error: "Payment not successful" },
        { status: 402 }
      );
    }

    // ── Update order ────────────────────────────────────────────────────────
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        status:        "CONFIRMED",
        paystackTxId:  String(psData.data.id),
      },
      include: { items: true },
    });

    // ── Send emails (non-blocking) ──────────────────────────────────────────
    void sendOrderConfirmationEmail(order as any).catch(console.error);
    void sendAdminOrderNotificationEmail(order as any).catch(console.error);

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (err) {
    console.error("[VERIFY]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

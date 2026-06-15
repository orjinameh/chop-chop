import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  sendOrderConfirmationEmail,
  sendAdminOrderNotificationEmail,
} from "@/lib/email";

/**
 * Paystack sends a webhook to this endpoint for payment events.
 * We verify the signature and update the order accordingly.
 *
 * Set this URL in your Paystack dashboard:
 *   https://yourdomain.com/api/webhook/paystack
 */
export async function POST(req: NextRequest) {
  try {
    const secret    = process.env.PAYSTACK_SECRET_KEY ?? "";
    const signature = req.headers.get("x-paystack-signature") ?? "";
    const body      = await req.text();

    // Verify HMAC signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const reference = event.data?.reference as string | undefined;
      if (!reference) {
        return NextResponse.json({ received: true });
      }

      // Find the order by Paystack ref
      const order = await prisma.order.findUnique({
        where:   { paystackRef: reference },
        include: { items: true },
      });

      if (!order) {
        console.warn("[WEBHOOK] Order not found for ref:", reference);
        return NextResponse.json({ received: true });
      }

      // Skip if already marked paid (e.g. inline callback already handled it)
      if (order.paymentStatus === "PAID") {
        return NextResponse.json({ received: true });
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status:        "CONFIRMED",
          paystackTxId:  String(event.data.id),
        },
        include: { items: true },
      });

      void sendOrderConfirmationEmail(updated as any).catch(console.error);
      void sendAdminOrderNotificationEmail(updated as any).catch(console.error);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[WEBHOOK]", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

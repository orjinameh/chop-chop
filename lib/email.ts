/**
 * Email service — uses Resend to send transactional emails.
 * Falls back to console.log in development if RESEND_API_KEY is not set.
 */

import { Resend } from "resend";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.RESEND_FROM_EMAIL ?? "orders@chopchop.ng";
const ADMIN  = process.env.ADMIN_EMAIL       ?? "admin@chopchop.ng";
const APP    = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Order confirmation to customer ──────────────────────────────────────────

export async function sendOrderConfirmationEmail(order: Order) {
  const itemRows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0">${i.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center">${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right">${formatPrice(i.subtotal)}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;color:#1c1917;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:4px">Chop Chop 🍽️</h1>
  <p style="color:#78716c;margin-top:0">Order Confirmed</p>
  <hr style="border:none;border-top:1px solid #e7e5e4;margin:24px 0"/>

  <h2 style="font-size:18px">Hi ${order.customerName},</h2>
  <p>Your order <strong>${order.orderNumber}</strong> has been received and is being processed.</p>

  <h3 style="font-size:15px;margin-bottom:8px">Order Summary</h3>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="color:#78716c;font-size:13px">
        <th style="text-align:left;padding-bottom:8px">Item</th>
        <th style="text-align:center;padding-bottom:8px">Qty</th>
        <th style="text-align:right;padding-bottom:8px">Total</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div style="margin-top:16px;text-align:right">
    <p style="margin:4px 0;color:#78716c">Subtotal: ${formatPrice(order.subtotal)}</p>
    <p style="margin:4px 0;color:#78716c">Delivery: ${formatPrice(order.deliveryFee)}</p>
    <p style="margin:4px 0;font-weight:700;font-size:18px">Total: ${formatPrice(order.total)}</p>
  </div>

  <hr style="border:none;border-top:1px solid #e7e5e4;margin:24px 0"/>
  <p style="color:#78716c;font-size:14px">
    Delivery to: ${order.deliveryAddress}<br/>
    Questions? Reply to this email.
  </p>
  <p style="color:#78716c;font-size:13px">Chop Chop — Great food, fast delivery.</p>
</body>
</html>`;

  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL] Order confirmation (no RESEND_API_KEY):", order.orderNumber);
    return;
  }

  await resend.emails.send({
    from:    FROM,
    to:      order.customerEmail,
    subject: `Order Confirmed — ${order.orderNumber} | Chop Chop`,
    html,
  });
}

// ─── New order notification to admin ─────────────────────────────────────────

export async function sendAdminOrderNotificationEmail(order: Order) {
  const itemList = order.items
    .map((i) => `• ${i.name} x${i.quantity} — ${formatPrice(i.subtotal)}`)
    .join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;color:#1c1917;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="font-size:20px;font-weight:700">🛎️ New Order — ${order.orderNumber}</h1>
  <p style="color:#78716c">A new order was placed on Chop Chop</p>
  <hr style="border:none;border-top:1px solid #e7e5e4;margin:20px 0"/>

  <h3 style="font-size:14px;color:#78716c;text-transform:uppercase;letter-spacing:.05em">Customer</h3>
  <p style="margin:0">${order.customerName}</p>
  <p style="margin:4px 0;color:#78716c">${order.customerEmail} · ${order.customerPhone}</p>
  <p style="margin:4px 0;color:#78716c">${order.deliveryAddress}</p>
  ${order.notes ? `<p style="margin:8px 0;font-style:italic">Note: ${order.notes}</p>` : ""}

  <h3 style="font-size:14px;color:#78716c;text-transform:uppercase;letter-spacing:.05em;margin-top:20px">Items</h3>
  <pre style="font-family:inherit;background:#f5f5f4;padding:12px;border-radius:6px;font-size:14px">${itemList}</pre>

  <p style="font-weight:700;font-size:18px">Total: ${formatPrice(order.total)}</p>

  <a href="${APP}/admin/orders/${order.id}"
     style="display:inline-block;background:#f97316;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:8px">
    View Order in Dashboard →
  </a>
</body>
</html>`;

  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL] Admin notification (no RESEND_API_KEY):", order.orderNumber);
    return;
  }

  await resend.emails.send({
    from:    FROM,
    to:      ADMIN,
    subject: `🛎️ New Order ${order.orderNumber} — ${formatPrice(order.total)}`,
    html,
  });
}

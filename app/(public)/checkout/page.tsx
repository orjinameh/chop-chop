import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Chop Chop order with secure Paystack payment.",
};

export default function CheckoutPage() {
  return (
    <div className="section">
      <div className="container-base max-w-4xl">
        <h1 className="text-2xl font-bold text-ink mb-2">Checkout</h1>
        <p className="text-sm text-ink-muted mb-8">
          Fill in your delivery details and pay securely via Paystack.
        </p>
        <CheckoutForm />
      </div>
    </div>
  );
}

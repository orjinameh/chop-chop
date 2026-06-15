import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your order before checkout.",
};

export default function CartPage() {
  return (
    <div className="section">
      <div className="container-base max-w-3xl">
        <h1 className="text-2xl font-bold text-ink mb-8">Your Cart</h1>
        <CartView />
      </div>
    </div>
  );
}

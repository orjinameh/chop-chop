import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order Confirmed" };

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { order } = await searchParams;

  return (
    <div className="section">
      <div className="container-base max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>

        <h1 className="text-3xl font-bold text-ink">Order Confirmed!</h1>
        <p className="mt-3 text-ink-muted">
          Thank you for your order. We&apos;ve received your payment and are preparing your food.
        </p>

        {order && (
          <div className="mt-6 card p-4 inline-block">
            <p className="text-sm text-ink-muted">Order Number</p>
            <p className="text-xl font-bold text-ink mt-1">{order}</p>
          </div>
        )}

        <p className="mt-6 text-sm text-ink-muted">
          A confirmation email has been sent to you. Your food will be delivered in 30–45 minutes.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/menu">Order More Food</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

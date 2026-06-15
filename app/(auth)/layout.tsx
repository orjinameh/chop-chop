import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 font-bold text-ink text-xl mb-8">
        <UtensilsCrossed className="h-6 w-6 text-brand-500" />
        Chop Chop
      </Link>
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ink-faint bg-white mt-auto">
      <div className="container-base py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-ink">
              <UtensilsCrossed className="h-5 w-5 text-brand-500" />
              Chop Chop
            </Link>
            <p className="mt-2 text-sm text-ink-muted max-w-xs">
              Great food, fast delivery. Bringing Nigerian and continental flavours to your door.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/",        label: "Home"   },
                { href: "/menu",    label: "Menu"   },
                { href: "/cart",    label: "Cart"   },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-muted hover:text-brand-500 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Contact
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>Lagos, Nigeria</li>
              <li>hello@chopchop.ng</li>
              <li>+234 800 000 0000</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-ink-faint pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} Chop Chop. All rights reserved.
          </p>
          <p className="text-xs text-ink-muted">
            Built by{" "}
            <span className="font-medium text-ink">Orjinamehthedeveloper</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

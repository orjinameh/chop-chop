import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default:  "Chop Chop — Great Food, Fast Delivery",
    template: "%s | Chop Chop",
  },
  description:
    "Order fresh Nigerian and continental meals online. Fast delivery across Lagos. Jollof rice, suya, shawarma, and more.",
  keywords: [
    "food delivery Nigeria",
    "jollof rice",
    "suya",
    "order food Lagos",
    "Nigerian food",
  ],
  openGraph: {
    type:        "website",
    locale:      "en_NG",
    url:         "/",
    siteName:    "Chop Chop",
    title:       "Chop Chop — Great Food, Fast Delivery",
    description: "Order fresh Nigerian and continental meals online.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Chop Chop — Great Food, Fast Delivery",
    description: "Order fresh Nigerian and continental meals online.",
    images:      ["/og-image.png"],
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor:   "#f97316",
  width:        "device-width",
  initialScale: 1,
};

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-surface font-sans text-ink antialiased">
        {children}
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1c1917",
              color:      "#fafaf9",
              borderRadius: "8px",
              fontSize:   "14px",
            },
            success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}

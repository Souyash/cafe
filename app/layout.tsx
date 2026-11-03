import type { Metadata } from "next";
import "./globals.css";
import { CafeProvider } from "@/lib/cafe-context";
import Link from "next/link";
import { Coffee, QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "Aura Artisan Roasters & Slow-Fermented Kitchen",
  description: "Boutique 7-table specialty cafe with instant HMAC table QR ordering and slow-fermented viennoiserie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#faf7f2] min-h-screen text-stone-900 selection:bg-amber-200 selection:text-amber-950 font-sans antialiased">
        <CafeProvider>
          {/* Elegant Customer Header */}
          <header className="bg-espresso-950 text-stone-300 text-xs border-b border-gold-500/20 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              {/* Brand mark */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-400 to-amber-700 flex items-center justify-center text-espresso-950 shadow-xs group-hover:scale-105 transition-transform">
                  <Coffee className="w-4 h-4 fill-espresso-950" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold tracking-widest text-white uppercase text-sm">
                    Aura
                  </span>
                  <span className="text-[10px] text-gold-300 tracking-wider font-light uppercase hidden sm:inline">
                    Artisan Roastery & Kitchen
                  </span>
                </div>
              </Link>

              {/* Customer navigation links */}
              <nav className="flex items-center gap-2 sm:gap-4">
                <a
                  href="/#tables-section"
                  className="text-stone-300 hover:text-gold-300 transition text-xs font-medium hidden sm:inline"
                >
                  Our 7 Tables
                </a>
                <a
                  href="/#menu-section"
                  className="text-stone-300 hover:text-gold-300 transition text-xs font-medium hidden sm:inline"
                >
                  Menu
                </a>
                <Link
                  href="/order?table=1"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-espresso-950 font-bold transition text-xs shadow-gold-glow"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Dine-In Order</span>
                </Link>
              </nav>
            </div>
          </header>

          {children}
        </CafeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { CafeProvider } from "@/lib/cafe-context";
import Link from "next/link";
import { Coffee, UtensilsCrossed, LayoutDashboard, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Aura Artisan Roasters & Slow-Fermented Kitchen",
  description: "Boutique 7-table specialty cafe with instant HMAC table QR ordering, real-time Kitchen Display (KDS), and back-office POS & CRM.",
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
          {/* Universal Persona Quick-Switcher Header */}
          <header className="bg-espresso-950 text-stone-300 text-xs border-b border-gold-500/20 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
              {/* Brand mark */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gold-400 to-amber-700 flex items-center justify-center text-espresso-950 shadow-xs group-hover:scale-105 transition-transform">
                  <Coffee className="w-3.5 h-3.5 fill-espresso-950" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold tracking-widest text-white uppercase text-xs">
                    Aura
                  </span>
                  <span className="text-[10px] text-gold-300 tracking-wider font-light uppercase hidden sm:inline">
                    Artisan Roastery & Kitchen
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-300 text-[10px] font-semibold border border-gold-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </Link>

              {/* Persona navigation links */}
              <nav className="flex items-center gap-2">
                <Link
                  href="/order?table=1"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-gold-200 border border-stone-800 hover:border-gold-500/40 transition text-[11px] font-medium"
                >
                  <Coffee className="w-3.5 h-3.5 text-gold-400" />
                  <span>Dine-In (Table 1)</span>
                </Link>

                <Link
                  href="/staff/kds"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-orange-200 border border-stone-800 hover:border-orange-500/40 transition text-[11px] font-medium"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                  <span>Kitchen (KDS)</span>
                </Link>

                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-gold-600 to-amber-700 hover:from-gold-500 hover:to-amber-600 text-espresso-950 hover:text-black font-bold transition text-[11px] shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin CRM</span>
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

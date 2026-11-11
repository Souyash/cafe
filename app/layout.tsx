import type { Metadata } from "next";
import "./globals.css";
import { CafeProvider } from "@/lib/cafe-context";
import Link from "next/link";
import { QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "স্বাদে আহ্লাদে ক্যাফেটেরিয়া | Swade Allade Cafeteria",
  description:
    "প্রিয় খাবার • প্রিয় আড্ডা • প্রিয় মুহূর্ত — Bamboo Cottage Garden Cafeteria serving Indian, Tandoor, Chinese, Continental & Artisanal Brews with instant 7-table QR ordering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#fcfaf2] min-h-screen text-garden-950 selection:bg-gold-200 selection:text-garden-950 font-sans antialiased">
        <CafeProvider>
          {/* Swade Allade Cafeteria Emerald & Gold Header */}
          <header className="bg-garden-950 text-stone-200 text-xs border-b border-gold-400/30 sticky top-0 z-50 backdrop-blur-md bg-opacity-95 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
              {/* Brand Mark using the uploaded 2nd image (/images/logo.jpg) */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gold-400 shadow-gold-glow bg-black flex-shrink-0 group-hover:scale-105 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo.jpg"
                    alt="Swade Allade Cafeteria Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold tracking-wide text-gold-300 text-sm sm:text-base leading-tight">
                    স্বাদে আহ্লাদে ক্যাফেটেরিয়া
                  </span>
                  <span className="text-[10px] text-emerald-300/90 tracking-widest uppercase font-medium">
                    Swade Allade • www.swadeallade.com
                  </span>
                </div>
              </Link>

              {/* Customer Navigation Links (Admin & Kitchen remain hidden in footer) */}
              <nav className="flex items-center gap-3 sm:gap-5">
                <a
                  href="/#tables-section"
                  className="text-stone-200 hover:text-gold-300 transition text-xs font-semibold hidden sm:inline"
                >
                  7 Bamboo Tables
                </a>
                <a
                  href="/#menu-section"
                  className="text-stone-200 hover:text-gold-300 transition text-xs font-semibold hidden sm:inline"
                >
                  Cuisines & Menu
                </a>
                <Link
                  href="/order?table=1"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-garden-950 font-extrabold transition text-xs shadow-gold-glow active:scale-95"
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useCafe } from "@/lib/cafe-context";
import { CafeTable, MenuItem } from "@/lib/data-store";
import {
  Coffee,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Star,
  ExternalLink,
  ChevronRight,
  Lock,
  Compass,
  Calendar,
  Wifi,
  X,
  Plus,
  Flame,
  CheckCircle2,
  Heart,
  Award,
  Layers,
  Utensils,
  Sun,
  Moon,
  Trees,
} from "lucide-react";

export default function HomePage() {
  const { tables, menu, orders } = useCafe();

  // Selected table for the interactive QR acrylic stand modal
  const [activeQrModalTable, setActiveQrModalTable] = useState<(CafeTable & { token: string }) | null>(null);
  const [modalQrUrl, setModalQrUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("All");
  const [selectedDietary, setSelectedDietary] = useState<"ALL" | "VEG" | "VEGAN" | "NON_VEG">("ALL");

  // Ensure tables strictly lists the 7 tables
  const sevenTables = tables.slice(0, 7);
  const occupiedCount = sevenTables.filter((t) => t.status === "OCCUPIED").length;
  const availableCount = sevenTables.filter((t) => t.status === "AVAILABLE").length;
  const activeKitchenOrders = orders.filter((o) => o.status !== "SERVED" && o.status !== "CANCELLED");

  // Generate QR image when modal opens
  useEffect(() => {
    if (!activeQrModalTable) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const orderUrl = `${origin}/order?table=${activeQrModalTable.number}&token=${activeQrModalTable.token}`;

    QRCode.toDataURL(orderUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#140c07",
        light: "#ffffff",
      },
    })
      .then((url) => setModalQrUrl(url))
      .catch((err) => console.error("Error generating modal QR:", err));
  }, [activeQrModalTable]);

  const copyModalLink = () => {
    if (!activeQrModalTable) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const orderUrl = `${origin}/order?table=${activeQrModalTable.number}&token=${activeQrModalTable.token}`;
    navigator.clipboard.writeText(orderUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredMenuItems = menu.filter((item) => {
    const matchesCategory = selectedMenuCategory === "All" || item.category === selectedMenuCategory;
    const matchesDietary =
      selectedDietary === "ALL" ||
      (selectedDietary === "VEG" && (item.dietary === "VEG" || item.dietary === "VEGAN")) ||
      (selectedDietary === "VEGAN" && item.dietary === "VEGAN") ||
      (selectedDietary === "NON_VEG" && item.dietary === "NON_VEG");
    return matchesCategory && matchesDietary;
  });

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 selection:bg-gold-200 selection:text-espresso-950 font-sans antialiased overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. CINEMATIC LUXURY HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative min-h-[90vh] flex flex-col justify-center bg-espresso-950 text-white overflow-hidden border-b border-gold-500/30">
        {/* Full-bleed atmospheric background photography with vignette & mesh overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=85"
            alt="Artisanal Cafe Interior"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-[1.1] transition-transform duration-1000 ease-out"
          />
          {/* Gradient shadows and warm amber ambient light */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/60 to-black/70" />
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-gold-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-7 text-left">
              {/* Crest Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/40 text-gold-300 text-xs font-semibold backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                <span className="font-display uppercase tracking-widest text-[11px]">
                  Specialty Roasters & Slow-Fermented Kitchen
                </span>
                <span className="text-gold-500">•</span>
                <span className="text-stone-300 font-normal">7 Physical Tables</span>
              </div>

              {/* Grand Editorial Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-normal tracking-tight text-white leading-[1.03]">
                Where Slow Craft <br />
                <span className="italic font-normal text-gold-gradient">
                  Meets Instant Comfort.
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-xl text-stone-200 max-w-2xl font-light leading-relaxed">
                Experience high-elevation Ethiopian micro-lots and 48-hour sourdough viennoiserie from the comfort of our
                <span className="text-gold-300 font-medium"> 7 boutique tables</span>. Tap your phone to the table stand to order instantly with zero app downloads.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#tables-section"
                  className="px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-espresso-950 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition-all flex items-center gap-2.5 active:scale-95"
                >
                  <QrCode className="w-4 h-4 text-espresso-950" />
                  <span>Choose Table (1 to 7)</span>
                </a>

                <a
                  href="#menu-section"
                  className="px-7 py-4 rounded-2xl font-semibold text-xs uppercase tracking-wider text-stone-100 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-gold-400/50 transition-all flex items-center gap-2"
                >
                  <Coffee className="w-4 h-4 text-gold-400" />
                  <span>Explore Menu</span>
                </a>
              </div>

              {/* Live Status Ticker Pill */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">{availableCount} of 7 Tables Open</span>
                </div>
                <div className="hidden sm:block text-stone-600">•</div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  <span>Dialed-in Today: 07:30 – 22:30</span>
                </div>
                <div className="hidden sm:block text-stone-600">•</div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HMAC Anti-Spoof Protection</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Card: Floating 7-Table Seat Picker */}
            <div className="lg:col-span-4">
              <div className="glass-panel p-6 rounded-3xl border border-gold-500/30 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div>
                    <span className="text-[10px] font-display uppercase tracking-widest text-gold-400">
                      Live Seating Map
                    </span>
                    <h3 className="text-base font-bold text-white">7 Tables Available</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    Real-Time
                  </span>
                </div>

                {/* Table Quick Seating Grid */}
                <div className="py-4 space-y-2">
                  {sevenTables.map((t) => (
                    <Link
                      key={t.id}
                      href={`/order?table=${t.number}&token=${t.token}`}
                      className="group p-2.5 rounded-xl bg-white/5 hover:bg-gold-500/20 border border-white/10 hover:border-gold-400/50 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold text-xs">
                          {t.number}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-gold-200 transition-colors">
                            {t.label}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            {t.zone} • {t.capacity} Seats
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            t.status === "AVAILABLE"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {t.status === "AVAILABLE" ? "Ready" : "Seated"}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold-300 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-stone-400 font-light">
                    Tap any table above to test instant mobile guest dining
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THE 7 PHYSICAL TABLES & SEATING FLOORPLAN */}
      {/* ======================================================== */}
      <section id="tables-section" className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 text-gold-800 border border-gold-500/20 text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5 text-gold-700" />
              <span>Interactive Table Seating Map</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-espresso-950 tracking-tight">
              The 7 Cafe Tables
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl font-light">
              Choose your favorite atmosphere. Every table is outfitted with a custom acrylic stand containing a signed
              HMAC QR code for direct ordering from your seat.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-stone-800">{availableCount} Tables Ready</span>
            </span>
            <span className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-bold text-stone-800">{occupiedCount} Tables Seated</span>
            </span>
          </div>
        </div>

        {/* The 7 Tables Display Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sevenTables.map((table) => {
            const tableOrder = orders.find((o) => o.tableNumber === table.number && o.status !== "SERVED");
            const isOccupied = table.status === "OCCUPIED" || Boolean(tableOrder);

            // Atmosphere icons
            const ZoneIcon =
              table.zone === "Patio" ? Trees : table.zone === "Rooftop" ? Moon : Sun;

            return (
              <div
                key={table.id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative group hover:shadow-luxury hover:-translate-y-1 ${
                  isOccupied
                    ? "border-amber-300/80 ring-1 ring-amber-200 bg-amber-50/20"
                    : "border-stone-200/90 hover:border-gold-400"
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex justify-between items-center mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200 tracking-wide">
                      <ZoneIcon className="w-3 h-3 text-amber-700" />
                      <span>{table.zone}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        isOccupied
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : table.status === "BILL_REQUESTED"
                          ? "bg-rose-100 text-rose-900 border border-rose-300"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOccupied ? "bg-amber-600 animate-pulse" : "bg-emerald-600"
                        }`}
                      />
                      {isOccupied ? "Seated" : table.status === "BILL_REQUESTED" ? "Bill Open" : "Available"}
                    </span>
                  </div>

                  {/* Title & Seats */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-espresso-950 group-hover:text-amber-800 transition-colors">
                      {table.label}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium mt-1">
                      Comfortably seats: <span className="font-bold text-stone-800">{table.capacity} Guests</span>
                    </div>
                  </div>

                  {/* Order Activity Box */}
                  {tableOrder ? (
                    <div className="mt-4 p-3 bg-amber-50/90 rounded-2xl border border-amber-200/80 text-xs space-y-1">
                      <div className="font-bold text-amber-900 flex items-center justify-between">
                        <span>Active Ticket #{tableOrder.orderNumber}</span>
                        <span className="text-[10px] uppercase font-bold text-amber-700">{tableOrder.status.replace("_", " ")}</span>
                      </div>
                      <div className="text-[11px] text-stone-600">
                        {tableOrder.items.length} dishes • Total: <span className="font-bold text-stone-900">₹{tableOrder.total}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-500 font-light">
                      Spotlessly sanitized with custom table acrylic stand. Ready for guests.
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
                  <Link
                    href={`/order?table=${table.number}&token=${table.token}`}
                    className="w-full py-3 bg-espresso-950 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>Order at Table #{table.number}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                  </Link>

                  <button
                    onClick={() => setActiveQrModalTable(table)}
                    className="w-full py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold border border-stone-200 transition flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-stone-500" />
                    <span>View Acrylic QR Stand</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* 8th Card: Private Bookings */}
          <div className="bg-espresso-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between border border-gold-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/40 text-gold-300 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Private Events</h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed font-light">
                Host an intimate coffee cupping masterclass or private dinner across all 7 tables with custom chef menus.
              </p>
            </div>

            <a
              href="tel:+919876543210"
              className="mt-6 py-3 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-espresso-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-gold-glow"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Inquire Private Hire</span>
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FOUR PILLARS OF CRAFTSMANSHIP */}
      {/* ======================================================== */}
      <section className="py-24 bg-espresso-950 text-white border-y border-gold-500/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-display tracking-widest text-gold-400">
              Our Culinary Standards
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight">
              Four Pillars of Aura Craft
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light max-w-lg mx-auto">
              We marry traditional culinary excellence with frictionless digital guest comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-7 rounded-3xl bg-espresso-900/60 border border-gold-500/20 space-y-4 hover:border-gold-400/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-display font-bold text-lg">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Single-Origin Roasts</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                High-altitude Ethiopian Yirgacheffe and Colombian Geisha varieties, slow batch roasted weekly and dialed in every morning at 07:00.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-espresso-900/60 border border-gold-500/20 space-y-4 hover:border-gold-400/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-display font-bold text-lg">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-white">32-Layer Lamination</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                Normandy butter, 48-hour cold fermentation sourdough levain, and handcrafted croissants baked golden fresh in our stone-deck oven.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-espresso-900/60 border border-gold-500/20 space-y-4 hover:border-gold-400/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-display font-bold text-lg">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Cryptographic QR Guard</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                Patented HMAC-SHA256 signed table tokens ensure orders are authentic and strictly originate from seated guests inside the cafe.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-espresso-900/60 border border-gold-500/20 space-y-4 hover:border-gold-400/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-display font-bold text-lg">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Artisan Speed & Care</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                Dual-boiler Italian extraction systems calibrated for 4-minute barista turnarounds without compromising micro-foam silkiness or temperature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CURATED ARTISANAL MENU */}
      {/* ======================================================== */}
      <section id="menu-section" className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 text-gold-800 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            <Coffee className="w-3.5 h-3.5 text-gold-700" />
            <span>Seasonal Roastery Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-espresso-950 tracking-tight">
            Curated Brews & Kitchen Specials
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light">
            Every cup and sourdough dish is prepared to order. Filter by category or dietary preferences.
          </p>

          {/* Category & Dietary Filter Controls */}
          <div className="pt-6 space-y-3">
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {["All", "Brews", "Bakery", "Mains", "Combos"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedMenuCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    selectedMenuCategory === cat
                      ? "bg-espresso-950 text-white shadow-md shadow-espresso-950/20"
                      : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 pt-1 text-xs">
              {[
                { id: "ALL", label: "Show All" },
                { id: "VEG", label: "🌱 Vegetarian" },
                { id: "VEGAN", label: "🌿 100% Vegan" },
                { id: "NON_VEG", label: "🥩 Non-Veg" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDietary(d.id as typeof selectedDietary)}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                    selectedDietary === d.id
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-white text-stone-500 hover:bg-stone-50 border border-stone-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Food Image with Category Tag */}
                <div className="relative h-60 w-full bg-stone-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3.5 left-3.5 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest font-display">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-black text-espresso-950 shadow-md">
                    ₹{item.price}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    {/* Dietary badge */}
                    <span
                      className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                        item.dietary === "NON_VEG" ? "border-rose-500" : "border-emerald-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.dietary === "NON_VEG" ? "bg-rose-500" : "bg-emerald-600"
                        }`}
                      />
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500">
                      {item.dietary === "NON_VEG" ? "Non-Veg" : item.dietary === "VEGAN" ? "Vegan" : "Vegetarian"}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.prepTime} mins
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-espresso-950 text-xl leading-snug group-hover:text-amber-800 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link
                  href={`/order?table=1&token=${tables[0]?.token || ""}`}
                  className="w-full py-3 bg-stone-100 hover:bg-espresso-950 hover:text-white text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-stone-200 shadow-xs"
                >
                  <span>Order at Table (₹{item.price})</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gold-500" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. GUEST TESTIMONIALS */}
      {/* ======================================================== */}
      <section className="py-24 bg-stone-100/70 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-display uppercase tracking-widest text-gold-700">Patron Acclaim</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-espresso-950">
              Loved by Coffee Aficionados
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light">
              Verified dining experiences from patrons seated across our 7 physical tables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Aarav Sharma",
                table: "Table 1 (Window Bay)",
                quote:
                  "The table QR flow is instantaneous. I customized my flat white with oat milk, and the kitchen had it poured and served within 4 minutes. Exceptional roast consistency!",
                stars: 5,
              },
              {
                name: "Priya Patel",
                table: "Table 2 (Booth A)",
                quote:
                  "Truffled avocado toast on slow-fermented levain sourdough is unmatched. Settle via UPI straight from your phone without flagging down waiters.",
                stars: 5,
              },
              {
                name: "Rohan Varma",
                table: "Table 5 (Patio Greenhouse)",
                quote:
                  "The patio greenhouse setting is peaceful, and earning 5% loyalty points on my phone number with every visit makes this my daily workspace.",
                stars: 5,
              },
            ].map((rev) => (
              <div key={rev.name} className="p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex gap-1 text-gold-500">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500" />
                  ))}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed italic font-light">&ldquo;{rev.quote}&rdquo;</p>
                <div className="pt-3 border-t border-stone-100">
                  <div className="font-bold text-sm text-stone-900">{rev.name}</div>
                  <div className="text-[11px] text-gold-700 font-medium">{rev.table}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. GRAND CAFE FOOTER WITH DISCREET HIDDEN STAFF PORTAL */}
      {/* ======================================================== */}
      <footer className="bg-espresso-950 text-stone-400 pt-20 pb-12 border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-white font-serif font-bold text-2xl">
              <Coffee className="w-6 h-6 text-gold-400" />
              <span>Aura Artisan Cafe</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Specialty roastery, viennoiserie bakery, and contactless table ordering platform. 7 boutique physical tables.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Wifi className="w-3.5 h-3.5" />
              <span>Fiber Guest Wi-Fi (Table Seating)</span>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-display uppercase tracking-widest text-white text-xs">Roastery Hours</h4>
            <div className="flex justify-between border-b border-stone-800 py-1.5 font-light">
              <span>Monday – Friday</span>
              <span className="text-stone-200 font-medium">07:30 – 22:30</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 py-1.5 font-light">
              <span>Saturday – Sunday</span>
              <span className="text-stone-200 font-medium">08:00 – 23:00</span>
            </div>
            <div className="pt-1 text-[11px] text-gold-400 font-medium">Breakfast Viennoiserie until 11:30 AM</div>
          </div>

          {/* Location */}
          <div className="space-y-3 text-xs font-light">
            <h4 className="font-display uppercase tracking-widest text-white text-xs">Roastery Address</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <span>42 Artisan Boulevard, Indiranagar, Bangalore 560038</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
          </div>

          {/* Guest Navigation */}
          <div className="space-y-3 text-xs">
            <h4 className="font-display uppercase tracking-widest text-white text-xs">Guest Experience</h4>
            <ul className="space-y-2 font-light">
              <li>
                <a href="#tables-section" className="hover:text-gold-300 transition">
                  Browse 7 Tables
                </a>
              </li>
              <li>
                <a href="#menu-section" className="hover:text-gold-300 transition">
                  Seasonal Menu
                </a>
              </li>
              <li>
                <Link href="/order?table=1" className="hover:text-gold-300 transition">
                  Dine-In Mobile Ordering
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright on Left, Discreet Hidden Staff Access on Right */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
          <div>
            © {new Date().getFullYear()} Aura Artisan Roastery & Slow-Fermented Kitchen. All rights reserved.
          </div>

          {/* Discreet Staff Portal (Hidden from ordinary customers) */}
          <div className="flex items-center gap-3 text-[11px] text-stone-700 hover:text-stone-400 transition-colors">
            <span className="flex items-center gap-1 opacity-50">
              <Lock className="w-3 h-3" />
              <span>Staff:</span>
            </span>
            <Link
              href="/staff/kds"
              className="hover:text-gold-400 transition underline underline-offset-4 decoration-stone-800"
            >
              Kitchen (KDS)
            </Link>
            <span className="opacity-30">•</span>
            <Link
              href="/admin/dashboard"
              className="hover:text-gold-400 transition underline underline-offset-4 decoration-stone-800"
            >
              Manager Hub
            </Link>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 7. PHYSICAL ACRYLIC QR STAND MODAL */}
      {/* ======================================================== */}
      {activeQrModalTable && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-[36px] max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 border border-gold-500/20">
            <button
              onClick={() => setActiveQrModalTable(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Acrylic Stand Preview */}
            <div className="border-2 border-espresso-950 rounded-[28px] p-6 bg-white shadow-xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-espresso-950 text-gold-400 flex items-center justify-center mx-auto mb-1">
                <Coffee className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-espresso-950 font-display">Aura Artisan Cafe</div>
              <div className="text-xs text-stone-500 font-light">Scan with mobile camera to order</div>

              {/* QR Image */}
              <div className="my-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 inline-block shadow-inner">
                {modalQrUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={modalQrUrl}
                    alt={`QR Code for ${activeQrModalTable.label}`}
                    className="w-44 h-44 rounded-xl"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-xs text-stone-400">Generating QR...</div>
                )}
              </div>

              <div className="text-xl font-serif font-bold text-espresso-950">{activeQrModalTable.label}</div>
              <div className="text-xs text-stone-500 font-light">
                {activeQrModalTable.zone} • {activeQrModalTable.capacity} Seats
              </div>
              <div className="text-[9px] text-stone-400 pt-2 border-t border-stone-100 font-mono">
                HMAC Signed Session Protection
              </div>
            </div>

            {/* Modal actions */}
            <div className="space-y-2 pt-1">
              <Link
                href={`/order?table=${activeQrModalTable.number}&token=${activeQrModalTable.token}`}
                className="w-full py-3 bg-espresso-950 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Table #{activeQrModalTable.number} in Browser</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              </Link>

              <button
                onClick={copyModalLink}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition"
              >
                {copiedLink ? "Signed Link Copied to Clipboard!" : "Copy Signed Table Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

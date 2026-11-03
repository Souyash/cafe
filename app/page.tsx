"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useCafe } from "@/lib/cafe-context";
import { CafeTable, MenuItem } from "@/lib/data-store";
import {
  Coffee,
  UtensilsCrossed,
  LayoutDashboard,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Receipt,
  Users,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Plus,
  Flame,
  Leaf,
  Wifi,
  Heart,
  X,
  Volume2,
  Award,
  Compass,
  Check,
} from "lucide-react";

export default function HomePage() {
  const { tables, menu, orders, customers } = useCafe();

  // Selected table for the interactive QR acrylic stand modal
  const [activeQrModalTable, setActiveQrModalTable] = useState<(CafeTable & { token: string }) | null>(null);
  const [modalQrUrl, setModalQrUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("All");

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
      width: 280,
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
    if (selectedMenuCategory === "All") return true;
    return item.category === selectedMenuCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 selection:bg-gold-200 selection:text-espresso-950">
      {/* ======================================================== */}
      {/* 1. LUXURY EDITORIAL HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-mesh-dark text-white pt-12 pb-24 sm:pt-20 sm:pb-36 border-b border-gold-500/20">
        {/* Subtle decorative gold light beams */}
        <div className="absolute -top-32 left-1/3 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Luxury CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Premium Heritage Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-medium tracking-wide backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-display uppercase tracking-widest text-[11px]">Boutique 7-Table Roastery & Kitchen</span>
              </div>

              {/* Main Headline with Serif Typography */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-white leading-[1.06]">
                The Alchemy of <br />
                <span className="italic font-normal text-gold-gradient">
                  Single-Origin Brews
                </span>
                <br />
                & Slow Ferment.
              </h1>

              {/* Narrative description */}
              <p className="text-base sm:text-lg text-stone-300 max-w-xl font-light leading-relaxed">
                Take your seat at any of our <span className="text-gold-300 font-semibold">7 boutique cafe tables</span>.
                Scan the table acrylic stand to browse our seasonal visual menu, customize your oat flat white,
                and send tickets directly to the kitchen display with zero app downloads.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#tables-section"
                  className="px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-espresso-950 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition-all flex items-center gap-2 active:scale-95"
                >
                  <QrCode className="w-4 h-4 text-espresso-950" />
                  <span>Choose Your Table (1 - 7)</span>
                </a>

                <a
                  href="#menu-section"
                  className="px-6 py-3.5 rounded-xl font-semibold text-xs tracking-wide text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-gold-500/30 hover:border-gold-400 transition flex items-center gap-2"
                >
                  <Coffee className="w-4 h-4 text-gold-400" />
                  <span>View Autumn Menu</span>
                </a>

                <Link
                  href="/staff/kds"
                  className="px-4 py-3.5 rounded-xl font-medium text-xs text-stone-400 hover:text-white bg-espresso-900/60 hover:bg-espresso-800 border border-stone-800 transition flex items-center gap-1.5"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                  <span>Live KDS Feed</span>
                </Link>
              </div>

              {/* Live Floor Stat Metrics */}
              <div className="pt-6 border-t border-gold-500/20 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-3xl font-display font-bold text-gold-300">7</div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mt-0.5">Physical Tables</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-emerald-400">{availableCount} Free</div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mt-0.5">Seating Open</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-amber-400">{activeKitchenOrders.length}</div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mt-0.5">Tickets in Prep</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Phone Mockup Preview */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 via-transparent to-amber-700/20 rounded-full blur-2xl transform scale-90" />

              {/* Realistic Mobile Device Frame */}
              <div className="relative w-72 sm:w-80 rounded-[40px] p-3 bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 shadow-2xl border-4 border-stone-700/70 shadow-gold-glow animate-float">
                {/* Speaker pill notch */}
                <div className="w-24 h-4 bg-stone-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-8 h-1 bg-stone-700 rounded-full" />
                </div>

                {/* Inner Screen */}
                <div className="bg-[#faf7f2] rounded-[30px] p-4 text-stone-900 text-left overflow-hidden relative shadow-inner">
                  {/* Screen Header */}
                  <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                    <div>
                      <div className="text-[9px] font-bold text-amber-800 uppercase tracking-widest font-display">Aura Cafe</div>
                      <div className="text-xs font-bold text-stone-900">Table #3 (Oak Bay)</div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Live Order
                    </span>
                  </div>

                  {/* Featured Item in Phone Mockup */}
                  <div className="mt-3 bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs flex gap-2.5">
                    <div className="w-14 h-14 rounded-lg bg-stone-200 overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=300&q=80"
                        alt="Flat White"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-stone-900 truncate">Artisanal Flat White</div>
                      <div className="text-[9px] text-stone-500">Oatly Barista • Double Ristretto</div>
                      <div className="text-xs font-extrabold text-amber-800 mt-0.5">₹285</div>
                    </div>
                  </div>

                  {/* Cooking Stepper Simulation inside Phone */}
                  <div className="mt-3 p-2.5 bg-espresso-950 rounded-xl text-white space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gold-300 font-bold">Kitchen Tracker</span>
                      <span className="text-stone-400">Ticket #102</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>In Kitchen (Brewing)</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-amber-500 to-gold-400 rounded-full" />
                    </div>
                  </div>

                  {/* Quick interactive launcher on phone */}
                  <Link
                    href={`/order?table=3&token=${tables[2]?.token || ""}`}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg text-[11px] font-bold text-center block shadow-sm hover:from-amber-600 hover:to-amber-700"
                  >
                    Open Live Guest Table #3 ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THE 7 PHYSICAL TABLES & SEATING FLOORPLAN */}
      {/* ======================================================== */}
      <section id="tables-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-700 border border-gold-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-gold-600" />
              <span>Boutique Floorplan & Live Seating</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-espresso-950 tracking-tight">
              Our 7 Signature Tables
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl font-light">
              Each table is paired with an acrylic stand holding an encrypted HMAC-SHA256 QR code. Tap below to launch
              guest ordering or view its physical acrylic stand.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-stone-800">{availableCount} Tables Ready</span>
            </span>
            <span className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-stone-800">{occupiedCount} Tables Seated</span>
            </span>
          </div>
        </div>

        {/* 7 Tables Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sevenTables.map((table) => {
            const tableOrder = orders.find((o) => o.tableNumber === table.number && o.status !== "SERVED");
            const isOccupied = table.status === "OCCUPIED" || Boolean(tableOrder);

            return (
              <div
                key={table.id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between relative group hover:shadow-luxury ${
                  isOccupied
                    ? "border-amber-300/80 ring-1 ring-amber-200 bg-amber-50/20"
                    : "border-stone-200/90 hover:border-gold-400"
                }`}
              >
                <div>
                  {/* Table Card Header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200 tracking-wide">
                      {table.zone}
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
                  <div className="mt-2">
                    <h3 className="text-2xl font-serif font-bold text-espresso-950 group-hover:text-amber-800 transition-colors">
                      {table.label}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium mt-1">
                      Capacity: <span className="font-bold text-stone-800">{table.capacity} Guests</span>
                    </div>
                  </div>

                  {/* Order Activity Box */}
                  {tableOrder ? (
                    <div className="mt-4 p-3 bg-amber-50/90 rounded-2xl border border-amber-200/80 text-xs space-y-1">
                      <div className="font-bold text-amber-900 flex items-center justify-between">
                        <span>Ticket #{tableOrder.orderNumber}</span>
                        <span className="text-[10px] uppercase font-bold text-amber-700">{tableOrder.status.replace("_", " ")}</span>
                      </div>
                      <div className="text-[11px] text-stone-600">
                        {tableOrder.items.length} dishes • Total: <span className="font-bold text-stone-900">₹{tableOrder.total}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-500">
                      Spotlessly sanitized. Ready for guest seating.
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
                  <Link
                    href={`/order?table=${table.number}&token=${table.token}`}
                    className="w-full py-2.5 bg-espresso-950 hover:bg-espresso-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-amber-800"
                  >
                    <span>Launch Table #{table.number} Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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

          {/* 8th Callout Box: Back-Office Hub */}
          <div className="bg-espresso-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between border border-gold-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/40 text-gold-300 flex items-center justify-center mb-4">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Manager QR Hub</h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Need to regenerate cryptographic salts, print acrylic stands for physical tables, or monitor live GMV?
              </p>
            </div>

            <Link
              href="/admin/dashboard"
              className="mt-6 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-espresso-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-gold-glow"
            >
              <span>Open Back-Office CRM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. CRAFTSMANSHIP & PILLARS SECTION */}
      {/* ======================================================== */}
      <section className="py-20 bg-espresso-950 text-white border-y border-gold-500/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-display tracking-widest text-gold-300">Our Culinary Philosophy</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal">Four Pillars of Aura Craft</h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light">
              Elevating the cafe experience through uncompromising ingredient sourcing and intelligent digital service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-espresso-900/60 border border-gold-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Micro-Lot Sourcing</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct-trade specialty beans from high-altitude Ethiopian and Colombian estates, roasted weekly and dialed in every morning.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-espresso-900/60 border border-gold-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-white">32-Layer Lamination</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                French Normandy butter, 48-hour cold fermentation sourdough, and handcrafted viennoiserie baked hourly for maximum flakiness.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-espresso-900/60 border border-gold-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Cryptographic QR Guard</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Patented HMAC-SHA256 table session tokens ensure that all placed orders originate strictly from verified physical table seatings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-espresso-900/60 border border-gold-500/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Zero-Latency Kitchen KDS</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Kitchen displays receive orders with real-time acoustic chimes, allowing baristas and chefs to prioritize tickets instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. ARTISANAL VISUAL MENU SHOWCASE */}
      {/* ======================================================== */}
      <section id="menu-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/10 text-gold-800 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            <Coffee className="w-3.5 h-3.5 text-gold-700" />
            <span>Seasonal Autumn Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-espresso-950 tracking-tight">
            Curated Brews & Kitchen Specials
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light">
            Every cup and plate prepared fresh to order. Customize add-ons and dietary preferences seamlessly.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap justify-center gap-2">
            {["All", "Brews", "Bakery", "Mains", "Combos"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedMenuCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedMenuCategory === cat
                    ? "bg-espresso-950 text-white shadow-md shadow-espresso-950/20"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Food Image with Category Tag */}
                <div className="relative h-56 w-full bg-stone-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest font-display">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-extrabold text-espresso-950 shadow-md">
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

                  <h3 className="font-serif font-bold text-espresso-950 text-lg leading-snug group-hover:text-amber-800 transition-colors">
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
                  className="w-full py-2.5 bg-stone-100 hover:bg-espresso-950 hover:text-white text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-stone-200"
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
      <section className="py-20 bg-stone-100/70 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-display uppercase tracking-widest text-gold-700">Patron Acclaim</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-espresso-950">
              Loved by Coffee Aficionados
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light">
              Verified reviews from patrons seated across our 7 physical tables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div key={rev.name} className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3">
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
      {/* 6. GRAND CAFE FOOTER */}
      {/* ======================================================== */}
      <footer className="bg-espresso-950 text-stone-400 pt-16 pb-12 border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-xl">
              <Coffee className="w-5 h-5 text-gold-400" />
              <span>Aura Artisan Cafe</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Specialty roastery, viennoiserie bakery, and contactless table ordering platform. 7 physical tables.
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
            <div className="pt-1 text-[11px] text-gold-400">Breakfast Viennoiserie until 11:30 AM</div>
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

          {/* Quick Route Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-display uppercase tracking-widest text-white text-xs">Live System Views</h4>
            <ul className="space-y-2 font-light">
              <li>
                <Link href="/order?table=1" className="hover:text-gold-300 transition">
                  Guest Table #1 View
                </Link>
              </li>
              <li>
                <Link href="/staff/kds" className="hover:text-orange-300 transition">
                  Kitchen Display System (KDS)
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-gold-300 transition">
                  Admin Command Hub & POS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-stone-800 text-center text-xs text-stone-500 font-light">
          © {new Date().getFullYear()} Aura Artisan Roastery & Slow-Fermented Kitchen. Built with Next.js App Router, Tailwind CSS, and Cryptographic HMAC QR Session Security.
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 7. PHYSICAL ACRYLIC QR STAND MODAL */}
      {/* ======================================================== */}
      {activeQrModalTable && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 border border-gold-500/20">
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
              <div className="text-xs text-stone-500">
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
                className="w-full py-2.5 bg-espresso-950 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
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

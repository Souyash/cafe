"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useCafe } from "@/lib/cafe-context";
import { CafeTable } from "@/lib/data-store";
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
  Trees,
  Home,
  Lamp,
  Utensils,
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

  // Generate QR image when modal opens
  useEffect(() => {
    if (!activeQrModalTable) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const orderUrl = `${origin}/order?table=${activeQrModalTable.number}&token=${activeQrModalTable.token}`;

    QRCode.toDataURL(orderUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#062c15",
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
    <div className="min-h-screen bg-[#fcfaf2] text-garden-950 selection:bg-gold-200 selection:text-garden-950 font-sans antialiased overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. BAMBOO GARDEN HERO SECTION WITH UPLOADED ARTWORK */}
      {/* ======================================================== */}
      <section className="relative min-h-[88vh] flex flex-col justify-center bg-garden-950 text-white overflow-hidden border-b-4 border-gold-500">
        {/* Background: 1st Uploaded Image (/images/hero-banner.jpg) */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-banner.jpg"
            alt="Swade Allade Cafeteria Bamboo Cottage & Garden"
            className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.08] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-garden-950 via-garden-950/65 to-black/75" />
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-garden-600/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-gold-400/15 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Logo Emblem, Bengali & English Headline, Cuisines Badges */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Circular Logo Crest (2nd image) + Grand Opening Crimson Pill */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] border-gold-400 shadow-gold-glow bg-black flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo.jpg"
                    alt="Swade Allade Cafeteria Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-crimson-600 text-white text-[11px] font-bold tracking-wide shadow-md border border-gold-300/40">
                    <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                    <span>সম্পূর্ণ বাঁশের কটেজে সুন্দর গার্ডেন ক্যাফে</span>
                  </div>
                  <div className="text-xs text-gold-300 font-semibold tracking-widest uppercase">
                    প্রিয় খাবার • প্রিয় আড্ডা • প্রিয় মুহূর্ত
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-[1.08]">
                <span className="text-gold-gradient">স্বাদে আহ্লাদে</span> <br />
                <span className="text-2xl sm:text-4xl font-normal text-emerald-100">
                  Bamboo Garden Cafeteria & Kitchen
                </span>
              </h1>

              {/* Narrative Description */}
              <p className="text-sm sm:text-lg text-stone-200 max-w-2xl font-light leading-relaxed">
                মায়াবী আলোক সজ্জা আর সম্পূর্ণ বাঁশের কটেজের মধ্যে প্রিয় মানুষের সঙ্গে আড্ডা দেওয়ার শ্রেষ্ঠ ঠিকানা।
                Choose any of our <span className="text-gold-300 font-bold">7 cozy tables</span> and order Indian, Tandoor,
                Chinese, Continental & Artisanal Brews straight from your phone.
              </p>

              {/* Signature Cuisine Pills matching the banner colours */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-4 py-1.5 rounded-full bg-garden-600 text-white border border-gold-400/60 text-xs font-bold shadow-sm">
                  ইন্ডিয়ান (Indian)
                </span>
                <span className="px-4 py-1.5 rounded-full bg-crimson-600 text-white border border-gold-400/60 text-xs font-bold shadow-sm">
                  তন্দুর (Tandoor)
                </span>
                <span className="px-4 py-1.5 rounded-full bg-garden-600 text-white border border-gold-400/60 text-xs font-bold shadow-sm">
                  চাইনিজ (Chinese)
                </span>
                <span className="px-4 py-1.5 rounded-full bg-crimson-600 text-white border border-gold-400/60 text-xs font-bold shadow-sm">
                  কন্টিনেন্টাল (Continental)
                </span>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#tables-section"
                  className="px-7 py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider text-garden-950 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition-all flex items-center gap-2 active:scale-95"
                >
                  <QrCode className="w-4 h-4 text-garden-950" />
                  <span>Select Your Table (1 – 7)</span>
                </a>

                <a
                  href="#menu-section"
                  className="px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-gold-300 bg-garden-900/80 hover:bg-garden-800 backdrop-blur-md border border-gold-400/40 transition-all flex items-center gap-2"
                >
                  <Utensils className="w-4 h-4 text-gold-400" />
                  <span>Browse Full Menu</span>
                </a>
              </div>

              {/* Live Status Strip */}
              <div className="pt-5 border-t border-gold-400/20 flex flex-wrap items-center gap-6 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">{availableCount} of 7 Tables Open</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  <span>Open Daily: 10:00 AM – 11:00 PM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>QR Anti-Spoof Verified</span>
                </div>
              </div>
            </div>

            {/* Right Column: Showcasing the Uploaded Promotional Artwork + Live 7-Table Picker */}
            <div className="lg:col-span-5 space-y-4">
              {/* Showcase card displaying the 1st uploaded banner artwork cleanly */}
              <div className="rounded-3xl overflow-hidden border-2 border-gold-400/70 shadow-2xl bg-garden-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-banner.jpg"
                  alt="Swade Allade Cafeteria Banner"
                  className="w-full h-56 sm:h-64 object-cover"
                />
              </div>

              {/* Live 7-Table Seat Selector Panel */}
              <div className="glass-panel p-5 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-gold-400/20">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-300 font-bold">
                      Instant Table Ordering
                    </span>
                    <h3 className="text-sm font-bold text-white">7 Bamboo Cottage & Garden Tables</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-garden-600 text-gold-200 border border-gold-400/40 text-[10px] font-bold">
                    Live Sync
                  </span>
                </div>

                <div className="py-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sevenTables.map((t) => (
                    <Link
                      key={t.id}
                      href={`/order?table=${t.number}&token=${t.token}`}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        t.status === "AVAILABLE"
                          ? "bg-garden-800/80 hover:bg-garden-600 border-gold-400/40 text-white"
                          : "bg-black/40 hover:bg-garden-900 border-white/15 text-stone-300"
                      }`}
                    >
                      <span className="text-xs font-extrabold text-gold-300">Table {t.number}</span>
                      <span className="text-[9px] text-stone-300 truncate max-w-full">{t.zone}</span>
                      <span
                        className={`mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          t.status === "AVAILABLE"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {t.status === "AVAILABLE" ? "Ready" : "Seated"}
                      </span>
                    </Link>
                  ))}
                  <a
                    href="#tables-section"
                    className="p-2 rounded-xl border border-gold-400/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 text-center flex flex-col items-center justify-center transition"
                  >
                    <QrCode className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-bold">View QRs</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THE 7 BAMBOO COTTAGE & GARDEN TABLES */}
      {/* ======================================================== */}
      <section id="tables-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 bg-mesh-light">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-garden-100 text-garden-800 border border-garden-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5 text-garden-700" />
              <span>Bamboo Cottage & Garden Floorplan</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-garden-950 tracking-tight">
              Our 7 Signature Tables
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Step into our fairy-lit bamboo cottages and lush garden patio. Tap any table to place your order or view its
              branded QR code stand.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-garden-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-garden-500" />
              <span className="font-bold text-garden-950">{availableCount} Tables Ready</span>
            </span>
            <span className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-gold-300 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-crimson-600" />
              <span className="font-bold text-garden-950">{occupiedCount} Tables Seated</span>
            </span>
          </div>
        </div>

        {/* 7 Tables Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sevenTables.map((table) => {
            const tableOrder = orders.find((o) => o.tableNumber === table.number && o.status !== "SERVED");
            const isOccupied = table.status === "OCCUPIED" || Boolean(tableOrder);

            const ZoneIcon =
              table.zone === "Garden Patio" ? Trees : table.zone === "Fairy Pavilion" ? Lamp : Home;

            return (
              <div
                key={table.id}
                className={`bg-white rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between relative group hover:shadow-luxury hover:-translate-y-1 ${
                  isOccupied
                    ? "border-gold-400 bg-gold-50/30"
                    : "border-garden-200/80 hover:border-garden-600"
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-garden-50 text-garden-800 border border-garden-200">
                      <ZoneIcon className="w-3 h-3 text-garden-700" />
                      <span>{table.zone}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        isOccupied
                          ? "bg-crimson-600 text-white"
                          : table.status === "BILL_REQUESTED"
                          ? "bg-gold-500 text-garden-950"
                          : "bg-garden-600 text-white"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOccupied ? "bg-gold-300 animate-pulse" : "bg-white"
                        }`}
                      />
                      {isOccupied ? "Seated" : table.status === "BILL_REQUESTED" ? "Bill Open" : "Available"}
                    </span>
                  </div>

                  {/* Title & Seats */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-garden-950 group-hover:text-garden-700 transition-colors">
                      {table.label}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium mt-1">
                      Comfortably seats: <span className="font-bold text-garden-900">{table.capacity} Guests</span>
                    </div>
                  </div>

                  {/* Order Activity Box */}
                  {tableOrder ? (
                    <div className="mt-4 p-3 bg-gold-50 rounded-2xl border border-gold-300 text-xs space-y-1">
                      <div className="font-bold text-garden-950 flex items-center justify-between">
                        <span>Ticket #{tableOrder.orderNumber}</span>
                        <span className="text-[10px] uppercase font-bold text-crimson-600">{tableOrder.status.replace("_", " ")}</span>
                      </div>
                      <div className="text-[11px] text-stone-700">
                        {tableOrder.items.length} dishes • Total: <span className="font-bold text-garden-950">₹{tableOrder.total}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-garden-50/70 rounded-2xl border border-garden-100 text-xs text-garden-800">
                      Sanitized bamboo table with warm fairy lighting. Ready for guests!
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
                  <Link
                    href={`/order?table=${table.number}&token=${table.token}`}
                    className="w-full py-3 bg-garden-800 hover:bg-garden-700 text-gold-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>Order at Table #{table.number}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                  </Link>

                  <button
                    onClick={() => setActiveQrModalTable(table)}
                    className="w-full py-2 bg-stone-50 hover:bg-gold-50 text-garden-900 rounded-xl text-xs font-semibold border border-stone-200 hover:border-gold-400 transition flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-garden-700" />
                    <span>View Branded QR Stand</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* 8th Card: Private Gatherings / Family Celebrations */}
          <div className="bg-garden-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between border-2 border-gold-400/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gold-400/15 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-400 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.jpg" alt="Swade Allade Logo" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gold-300">প্রিয় আড্ডা ও পার্টি</h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed font-light">
                Celebrate birthdays, anniversaries, and family adda across all 7 bamboo cottages with curated Indian, Tandoor & Chinese platters.
              </p>
            </div>

            <a
              href="tel:+919876543210"
              className="mt-6 py-3 bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-gold-400/50 shadow-md"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-300" />
              <span>Book Garden Party</span>
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. MULTI-CUISINE HIGHLIGHTS (BANNER COLOR STRIP) */}
      {/* ======================================================== */}
      <section className="py-16 bg-garden-950 text-white border-y-4 border-gold-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="inline-block px-4 py-1 rounded-full bg-gold-400 text-garden-950 text-xs font-extrabold tracking-wide">
              সব ধরনের খাবার পাওয়া যায়!
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Four Signature Kitchens Under One Roof
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80">
              Authentic flavors crafted fresh inside our bamboo kitchen and served warm to your garden table.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-garden-900 border-2 border-garden-600 space-y-3 hover:border-gold-400 transition">
              <div className="inline-block px-3 py-1 rounded-full bg-garden-600 text-white text-xs font-extrabold border border-gold-400/50">
                ইন্ডিয়ান (Indian)
              </div>
              <h3 className="font-serif text-lg font-bold text-gold-300">Royal Dum & Curries</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Aromatic saffron biryani, velvety paneer butter masala, and crisp butter-brushed garlic naans.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-garden-900 border-2 border-crimson-700 space-y-3 hover:border-gold-400 transition">
              <div className="inline-block px-3 py-1 rounded-full bg-crimson-600 text-white text-xs font-extrabold border border-gold-400/50">
                তন্দুর (Tandoor)
              </div>
              <h3 className="font-serif text-lg font-bold text-gold-300">Live Charcoal Grill</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Smoky chicken tikka kebabs, malai broccoli, and blistered clay-oven platters served sizzling hot.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-garden-900 border-2 border-garden-600 space-y-3 hover:border-gold-400 transition">
              <div className="inline-block px-3 py-1 rounded-full bg-garden-600 text-white text-xs font-extrabold border border-gold-400/50">
                চাইনিজ (Chinese)
              </div>
              <h3 className="font-serif text-lg font-bold text-gold-300">Kolkata Style Wok</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Fiery wok-tossed Hakka noodles, chilli chicken, burnt garlic fried rice & crispy honey lotus stem.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-garden-900 border-2 border-crimson-700 space-y-3 hover:border-gold-400 transition">
              <div className="inline-block px-3 py-1 rounded-full bg-crimson-600 text-white text-xs font-extrabold border border-gold-400/50">
                কন্টিনেন্টাল (Continental)
              </div>
              <h3 className="font-serif text-lg font-bold text-gold-300">Pastas, Steaks & Brews</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Creamy Alfredo olive penne, herb-crusted chicken steaks, signature cold coffees & garden coolers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. VISUAL MENU SHOWCASE */}
      {/* ======================================================== */}
      <section id="menu-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-garden-100 text-garden-800 border border-garden-300 text-xs font-bold uppercase tracking-wider">
            <Coffee className="w-3.5 h-3.5 text-garden-700" />
            <span>Swade Allade Kitchen Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-garden-950 tracking-tight">
            প্রিয় খাবার — Explore Our Dishes
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Prepared fresh on order. Filter by cuisine or dietary preference and order straight from your table.
          </p>

          {/* Category & Dietary Filter Controls */}
          <div className="pt-6 space-y-3">
            <div className="flex flex-wrap justify-center gap-2">
              {["All", "Indian", "Tandoor", "Chinese", "Continental", "Brews"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedMenuCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    selectedMenuCategory === cat
                      ? "bg-garden-800 text-gold-300 border-2 border-gold-400 shadow-md"
                      : "bg-white text-garden-900 hover:bg-garden-50 border border-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-1 text-xs">
              {[
                { id: "ALL", label: "Show All" },
                { id: "VEG", label: "🌱 Vegetarian" },
                { id: "VEGAN", label: "🌿 100% Vegan" },
                { id: "NON_VEG", label: "🍗 Non-Veg" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDietary(d.id as typeof selectedDietary)}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                    selectedDietary === d.id
                      ? "bg-crimson-600 text-white shadow-xs"
                      : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
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
              className="bg-white rounded-3xl border border-garden-200/80 overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="relative h-60 w-full bg-stone-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3.5 left-3.5 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-[10px] font-extrabold uppercase tracking-widest border border-gold-400/50 shadow-sm ${
                        item.category === "Tandoor" || item.category === "Continental"
                          ? "bg-crimson-600"
                          : "bg-garden-700"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 right-3.5 bg-garden-950/95 text-gold-300 border border-gold-400/60 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md">
                    ₹{item.price}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                        item.dietary === "NON_VEG" ? "border-crimson-600" : "border-garden-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.dietary === "NON_VEG" ? "bg-crimson-600" : "bg-garden-600"
                        }`}
                      />
                    </span>
                    <span className="text-[11px] font-semibold text-stone-600">
                      {item.dietary === "NON_VEG" ? "Non-Veg" : item.dietary === "VEGAN" ? "Vegan" : "Vegetarian"}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-garden-700" />
                      {item.prepTime} mins
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-garden-950 text-xl leading-snug group-hover:text-garden-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/order?table=1&token=${tables[0]?.token || ""}`}
                  className="w-full py-3 bg-garden-50 hover:bg-garden-800 hover:text-gold-300 text-garden-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-garden-200 shadow-xs"
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
      {/* 5. PATRON REVIEWS */}
      {/* ======================================================== */}
      <section className="py-20 bg-garden-100/50 border-t border-garden-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-crimson-600">প্রিয় মুহূর্ত</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-garden-950">
              Loved by Our Garden Patrons
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Heartfelt memories shared across our 7 bamboo cottage and garden tables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Souvik Chatterjee",
                table: "Cottage Table 1",
                quote:
                  "The fairy-lit bamboo cottage vibe at night is magical! We scanned the table QR and got our Chicken Tikka & Cold Coffee served sizzling hot.",
                stars: 5,
              },
              {
                name: "Riya Banerjee",
                table: "Cottage Table 2",
                quote:
                  "Best Kolkata-style Hakka Noodles and Mango Cooler in town. Paying via UPI straight from our seat made the adda effortless.",
                stars: 5,
              },
              {
                name: "Arjun Mukherjee",
                table: "Garden Table 5",
                quote:
                  "Whether it is Creamy Alfredo Pasta or Royal Saffron Biryani, every dish at Swade Allade hits the spot. Truly great hospitality!",
                stars: 5,
              },
            ].map((rev) => (
              <div key={rev.name} className="p-7 rounded-3xl bg-white border border-garden-200 shadow-xs space-y-4">
                <div className="flex gap-1 text-gold-500">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-500" />
                  ))}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed italic">&ldquo;{rev.quote}&rdquo;</p>
                <div className="pt-3 border-t border-stone-100">
                  <div className="font-bold text-sm text-garden-950">{rev.name}</div>
                  <div className="text-[11px] text-garden-700 font-semibold">{rev.table}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. GRAND FOOTER WITH LOGO & DISCREET HIDDEN STAFF PORTAL */}
      {/* ======================================================== */}
      <footer className="bg-garden-950 text-stone-300 pt-16 pb-12 border-t-4 border-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          {/* Brand info with Circular Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400 shadow-gold-glow bg-black flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.jpg" alt="Swade Allade Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-gold-300 font-bold text-base">স্বাদে আহ্লাদে ক্যাফেটেরিয়া</div>
                <div className="text-[11px] text-emerald-300 uppercase tracking-wider">www.swadeallade.com</div>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              প্রিয় খাবার • প্রিয় আড্ডা • প্রিয় মুহূর্ত — Bamboo cottage garden cafeteria serving Indian, Tandoor, Chinese & Continental delicacies.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Wifi className="w-3.5 h-3.5" />
              <span>Complimentary Garden Wi-Fi</span>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-display uppercase tracking-widest text-gold-300 text-xs">Cafeteria Hours</h4>
            <div className="flex justify-between border-b border-garden-800 py-1.5">
              <span>Monday – Friday</span>
              <span className="text-white font-semibold">10:00 AM – 11:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-garden-800 py-1.5">
              <span>Saturday – Sunday</span>
              <span className="text-white font-semibold">09:30 AM – 11:30 PM</span>
            </div>
            <div className="pt-1 text-[11px] text-gold-400 font-medium">Evening Fairy-Light Garden Open Daily</div>
          </div>

          {/* Location */}
          <div className="space-y-3 text-xs">
            <h4 className="font-display uppercase tracking-widest text-gold-300 text-xs">Visit Us</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <span>Swade Allade Bamboo Cottage Garden, West Bengal</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
          </div>

          {/* Guest Navigation */}
          <div className="space-y-3 text-xs">
            <h4 className="font-display uppercase tracking-widest text-gold-300 text-xs">Guest Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="#tables-section" className="hover:text-gold-300 transition">
                  7 Bamboo Tables
                </a>
              </li>
              <li>
                <a href="#menu-section" className="hover:text-gold-300 transition">
                  Indian • Tandoor • Chinese • Continental
                </a>
              </li>
              <li>
                <Link href="/order?table=1" className="hover:text-gold-300 transition">
                  Mobile QR Ordering
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright on Left, Discreet Hidden Staff Access on Right */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-garden-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} স্বাদে আহ্লাদে ক্যাফেটেরিয়া (Swade Allade Cafeteria). All rights reserved.
          </div>

          {/* Discreet Staff Portal (Hidden from ordinary customers) */}
          <div className="flex items-center gap-3 text-[11px] text-emerald-900/80 hover:text-gold-300 transition-colors">
            <span className="flex items-center gap-1 opacity-70">
              <Lock className="w-3 h-3" />
              <span>Staff:</span>
            </span>
            <Link
              href="/staff/kds"
              className="hover:text-gold-400 transition underline underline-offset-4 decoration-garden-800"
            >
              Kitchen (KDS)
            </Link>
            <span className="opacity-30">•</span>
            <Link
              href="/admin/dashboard"
              className="hover:text-gold-400 transition underline underline-offset-4 decoration-garden-800"
            >
              Manager Hub
            </Link>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 7. BRANDED TABLE QR STAND MODAL */}
      {/* ======================================================== */}
      {activeQrModalTable && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-[36px] max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 border-2 border-gold-400">
            <button
              onClick={() => setActiveQrModalTable(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Branded Acrylic Stand Preview */}
            <div className="border-2 border-garden-800 rounded-[28px] p-6 bg-gradient-to-b from-garden-950 to-garden-900 text-white shadow-xl space-y-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-400 mx-auto mb-1 bg-black shadow-gold-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.jpg" alt="Swade Allade Logo" className="w-full h-full object-cover" />
              </div>
              <div className="text-sm font-bold text-gold-300">স্বাদে আহ্লাদে ক্যাফেটেরিয়া</div>
              <div className="text-[11px] text-emerald-200">Scan to Order & Pay from Your Seat</div>

              {/* QR Image */}
              <div className="my-3 p-3 bg-white rounded-2xl border-2 border-gold-400 inline-block shadow-inner">
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

              <div className="text-xl font-serif font-bold text-gold-300">{activeQrModalTable.label}</div>
              <div className="text-xs text-emerald-200">
                {activeQrModalTable.zone} • {activeQrModalTable.capacity} Seats
              </div>
              <div className="text-[9px] text-gold-300/70 pt-2 border-t border-garden-700 font-mono">
                www.swadeallade.com • Verified QR Token
              </div>
            </div>

            {/* Modal actions */}
            <div className="space-y-2 pt-1">
              <Link
                href={`/order?table=${activeQrModalTable.number}&token=${activeQrModalTable.token}`}
                className="w-full py-3 bg-garden-800 hover:bg-garden-700 text-gold-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Table #{activeQrModalTable.number} in Browser</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              </Link>

              <button
                onClick={copyModalLink}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-garden-950 rounded-xl text-xs font-semibold transition"
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

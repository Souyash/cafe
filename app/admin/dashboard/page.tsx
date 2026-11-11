"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useCafe } from "@/lib/cafe-context";
import { CafeTable, MenuItem, Customer } from "@/lib/data-store";
import {
  LayoutDashboard,
  QrCode,
  Coffee,
  Receipt,
  Users,
  TrendingUp,
  RefreshCw,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Plus,
  Power,
  ShieldCheck,
  CreditCard,
  DollarSign,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const {
    tables,
    menu,
    orders,
    customers,
    bills,
    toggleMenuStock,
    rotateTableQR,
    settleBill,
    refreshState,
  } = useCafe();

  const [activeTab, setActiveTab] = useState<
    "overview" | "tables" | "menu" | "billing" | "crm" | "analytics"
  >("overview");

  // Selected table for detailed QR preview
  const [selectedTable, setSelectedTable] = useState<CafeTable & { token: string }>(tables[0]);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [rotating, setRotating] = useState(false);

  // Sync selected table if tables change
  useEffect(() => {
    if (tables.length > 0 && (!selectedTable || !tables.find((t) => t.id === selectedTable.id))) {
      setSelectedTable(tables[0]);
    }
  }, [tables, selectedTable]);

  // Generate QR code data URL whenever selectedTable or its token changes
  useEffect(() => {
    if (!selectedTable) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const orderUrl = `${origin}/order?table=${selectedTable.number}&token=${selectedTable.token}`;

    QRCode.toDataURL(orderUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: "#261b11",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Gen error:", err));
  }, [selectedTable]);

  const handleCopyLink = () => {
    if (!selectedTable) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const orderUrl = `${origin}/order?table=${selectedTable.number}&token=${selectedTable.token}`;
    navigator.clipboard.writeText(orderUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRotateSecret = async () => {
    if (!selectedTable) return;
    setRotating(true);
    const newToken = await rotateTableQR(selectedTable.number);
    setRotating(false);
    if (newToken) {
      setSelectedTable((prev) => ({ ...prev, token: newToken }));
    }
  };

  // Analytics Calculations
  const totalGMV = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);

  const totalItemsSold = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  const occupiedCount = tables.filter((t) => t.status === "OCCUPIED").length;
  const occupancyRate = Math.round((occupiedCount / (tables.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#fcfaf2] text-garden-950 pb-16">
      {/* Admin Top Banner */}
      <div className="bg-garden-950 text-white border-b-2 border-gold-400/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gold-400 bg-black shadow-gold-glow flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.jpg" alt="Swade Allade Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gold-300">Swade Allade Command Center</h1>
              <p className="text-xs text-emerald-200/80">স্বাদে আহ্লাদে • Back-office CRM, Dynamic QR Engine & POS Billing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshState()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-garden-800 hover:bg-garden-700 text-gold-200 rounded-lg text-xs font-semibold border border-gold-400/30 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-garden-900 text-emerald-300 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Store Open
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-garden-800 pt-2 bg-white">
          {[
            { id: "overview", label: "Overview & Floor", icon: LayoutDashboard },
            { id: "tables", label: "Dynamic Table QRs", icon: QrCode },
            { id: "menu", label: "Menu & Stock", icon: Coffee },
            { id: "billing", label: "Billing & Settlement", icon: Receipt },
            { id: "crm", label: "Customer Loyalty CRM", icon: Users },
            { id: "analytics", label: "Sales Analytics", icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 whitespace-nowrap ${
                  isActive
                    ? "border-garden-700 text-garden-900 bg-garden-50"
                    : "border-transparent text-stone-600 hover:text-garden-900 hover:bg-stone-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW & FLOOR PLAN */}
        {/* ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start text-stone-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales (GMV)</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 mt-2">₹{totalGMV.toFixed(2)}</div>
                <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                  <span>+18.4%</span>
                  <span className="text-stone-400 font-normal">vs yesterday</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start text-stone-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Floor Occupancy</span>
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 mt-2">{occupancyRate}%</div>
                <div className="text-xs text-stone-500 mt-1 font-medium">
                  {occupiedCount} of {tables.length} tables seated
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start text-stone-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Kitchen Order Volume</span>
                  <Coffee className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 mt-2">{orders.length} Tickets</div>
                <div className="text-xs text-stone-500 mt-1 font-medium">{totalItemsSold} items crafted</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-start text-stone-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Avg Turnaround Time</span>
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 mt-2">24.5 mins</div>
                <div className="text-xs text-emerald-600 mt-1 font-medium">Fast table turn</div>
              </div>
            </div>

            {/* Live Table Layout Grid */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-base font-bold text-stone-900">Live Cafe Floor Map</h2>
                  <p className="text-xs text-stone-500">Click any table to view seating, token status or open bills</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Occupied
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Bill Requested
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {tables.map((t) => {
                  const tableOrder = orders.find((o) => o.tableNumber === t.number && o.status !== "SERVED");
                  const isOccupied = t.status === "OCCUPIED" || Boolean(tableOrder);

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTable(t);
                        setActiveTab("tables");
                      }}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition relative group hover:shadow-md ${
                        isOccupied
                          ? "bg-amber-50/70 border-amber-300"
                          : t.status === "BILL_REQUESTED"
                          ? "bg-rose-50 border-rose-300"
                          : "bg-stone-50 border-stone-200 hover:border-amber-400"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-stone-500">{t.zone}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOccupied
                              ? "bg-amber-500 animate-pulse"
                              : t.status === "BILL_REQUESTED"
                              ? "bg-rose-500"
                              : "bg-emerald-500"
                          }`}
                        />
                      </div>

                      <div className="text-lg font-black text-stone-900 mt-2">{t.label}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{t.capacity} Seats</div>

                      {tableOrder ? (
                        <div className="mt-2 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                          Ticket #{tableOrder.orderNumber} ({tableOrder.status.replace("_", " ")})
                        </div>
                      ) : (
                        <div className="mt-2 text-[11px] font-medium text-emerald-700">Ready for Guests</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DYNAMIC TABLE QR ENGINE */}
        {/* ======================================================== */}
        {activeTab === "tables" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Table Selector Column */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-stone-900">Select Cafe Table</h2>
              <p className="text-xs text-stone-500">Pick a table to generate its HMAC-signed physical QR stand</p>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {tables.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTable(t)}
                    className={`w-full p-3 rounded-xl border text-left flex justify-between items-center text-xs transition ${
                      selectedTable?.id === t.id
                        ? "bg-amber-700 text-white font-bold border-amber-700 shadow-sm"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <div>
                      <div className="font-bold">{t.label}</div>
                      <div className={selectedTable?.id === t.id ? "text-amber-200" : "text-stone-400"}>
                        {t.zone} • {t.capacity} Seats
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>
                ))}
              </div>
            </div>

            {/* QR Card Preview & Controls */}
            {selectedTable && (
              <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col items-center text-center space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Table Stand Generator</span>
                  <h2 className="text-2xl font-black text-stone-900 mt-1">{selectedTable.label} ({selectedTable.zone})</h2>
                  <p className="text-xs text-stone-500 mt-1 max-w-md">
                    Encodes HMAC-SHA256 signature salt & session limits. Spoofed orders from outside the cafe are blocked.
                  </p>
                </div>

                {/* Physical Table Acrylic Stand Preview */}
                <div
                  id="printable-table-qr"
                  className="w-72 bg-gradient-to-b from-garden-950 to-garden-900 border-2 border-gold-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden text-white"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-400 bg-black mb-2 shadow-gold-glow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/logo.jpg" alt="Swade Allade Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm font-bold text-gold-300">স্বাদে আহ্লাদে ক্যাফেটেরিয়া</div>
                  <div className="text-xs text-emerald-200 font-medium">Scan to Order & Pay</div>

                  {/* QR Image */}
                  <div className="my-4 p-2.5 bg-white rounded-2xl border-2 border-gold-400 shadow-inner">
                    {qrDataUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={qrDataUrl} alt={`QR for ${selectedTable.label}`} className="w-48 h-48 rounded-xl" />
                    ) : (
                      <div className="w-48 h-48 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                        Generating...
                      </div>
                    )}
                  </div>

                  <div className="text-xl font-black text-gold-300">{selectedTable.label}</div>
                  <div className="text-[10px] text-emerald-200/70 font-mono mt-1">
                    Salt: {selectedTable.secretSalt.slice(0, 14)}...
                  </div>

                  <div className="mt-3 pt-3 border-t border-garden-700 w-full text-[9px] text-gold-300/80">
                    www.swadeallade.com • Tap to Pay
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold border border-stone-300 transition"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? "Link Copied!" : "Copy Guest URL"}</span>
                  </button>

                  <a
                    href={`/order?table=${selectedTable.number}&token=${selectedTable.token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold border border-stone-300 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in Guest View</span>
                  </a>

                  <button
                    onClick={handleRotateSecret}
                    disabled={rotating}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold border border-amber-300 transition"
                  >
                    <RefreshCw className={`w-4 h-4 ${rotating ? "animate-spin" : ""}`} />
                    <span>Rotate Secret (Anti-Spoof Reset)</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Table Stand Acrylic</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MENU & STOCK MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === "menu" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-stone-900">Menu & 86 Inventory Controls</h2>
                <p className="text-xs text-stone-500">Toggle live availability across guest phones instantly</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menu.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-stone-200 flex items-center justify-between gap-4 bg-stone-50/50 hover:bg-white transition"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-stone-200" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 font-semibold text-stone-700">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-stone-500 mt-0.5">₹{item.price}</div>
                    </div>
                  </div>

                  {/* Stock Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${item.isAvailable ? "text-emerald-700" : "text-rose-600"}`}>
                      {item.isAvailable ? "In Stock" : "Sold Out (86)"}
                    </span>
                    <button
                      onClick={() => toggleMenuStock(item.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        item.isAvailable ? "bg-emerald-600" : "bg-stone-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          item.isAvailable ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: BILLING & POS SETTLEMENT */}
        {/* ======================================================== */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-stone-900 mb-1">Open Table Accounts & Settlements</h2>
              <p className="text-xs text-stone-500 mb-4">Reconcile cash, card, and UPI transactions</p>

              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 bg-stone-50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">Table #{o.tableNumber}</span>
                        <span className="text-xs text-stone-500">Ticket #{o.orderNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            o.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {o.items.length} items • Total: <span className="font-bold text-stone-900">₹{o.total}</span>
                      </div>
                    </div>

                    {o.paymentStatus !== "PAID" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            settleBill({
                              orderId: o.id,
                              tableNumber: o.tableNumber,
                              paymentMethod: "CASH",
                            })
                          }
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Settle Cash
                        </button>
                        <button
                          onClick={() =>
                            settleBill({
                              orderId: o.id,
                              tableNumber: o.tableNumber,
                              paymentMethod: "RAZORPAY",
                            })
                          }
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                        >
                          Settle Online / UPI
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CUSTOMER CRM & LOYALTY */}
        {/* ======================================================== */}
        {activeTab === "crm" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Patron Loyalty Ledger</h2>
              <p className="text-xs text-stone-500">Track repeat guests, loyalty points (5% cashback), and lifetime spend</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-3">Patron Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Visits</th>
                    <th className="p-3">Loyalty Points</th>
                    <th className="p-3">Lifetime Spend</th>
                    <th className="p-3">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-stone-900">{c.name}</td>
                      <td className="p-3 text-stone-600 font-mono">{c.phone}</td>
                      <td className="p-3">{c.visitsCount} visits</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                          {c.loyaltyPoints} pts
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-stone-900">₹{c.totalSpent}</td>
                      <td className="p-3 text-stone-500">{c.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: SALES ANALYTICS */}
        {/* ======================================================== */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">Top 5 Bestselling Items</h3>
              <div className="space-y-2 pt-2">
                {[
                  { name: "Royal Saffron Chicken Biryani", count: 52, revenue: "₹16,640" },
                  { name: "Smoky Charcoal Chicken Tikka Kebab", count: 44, revenue: "₹14,960" },
                  { name: "Kolkata Street Hakka Noodles & Chilli Chicken", count: 38, revenue: "₹11,210" },
                  { name: "Swade Signature Cold Coffee & Gelato", count: 35, revenue: "₹6,650" },
                  { name: "Creamy Alfredo Olive & Mushroom Penne", count: 24, revenue: "₹7,440" },
                ].map((item, idx) => (
                  <div key={item.name} className="flex justify-between items-center text-xs p-2 rounded-lg bg-stone-50">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-garden-700 text-gold-300 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-stone-900">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-900">{item.revenue}</span>
                      <span className="text-stone-400 text-[11px] ml-2">({item.count} sold)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">Peak Ordering Hours</h3>
              <p className="text-xs text-stone-500">Order ticket volume distribution across operating shifts</p>

              <div className="space-y-3 pt-3">
                {[
                  { hour: "08:00 - 10:00 (Breakfast)", pct: 65 },
                  { hour: "10:00 - 12:00 (Morning Rush)", pct: 95 },
                  { hour: "12:00 - 15:00 (Lunch Rush)", pct: 85 },
                  { hour: "15:00 - 18:00 (Afternoon Brews)", pct: 50 },
                  { hour: "18:00 - 22:00 (Evening Social)", pct: 78 },
                ].map((shift) => (
                  <div key={shift.hour} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-stone-700">
                      <span>{shift.hour}</span>
                      <span>{shift.pct}% capacity</span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-700 rounded-full transition-all"
                        style={{ width: `${shift.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


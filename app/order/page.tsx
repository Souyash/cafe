"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCafe } from "@/lib/cafe-context";
import { MenuItem, SelectedAddon, OrderItem } from "@/lib/data-store";
import {
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Clock,
  ShieldCheck,
  ShieldAlert,
  X,
  CheckCircle2,
  Receipt,
  UtensilsCrossed,
  Phone,
  User,
  Coffee,
  CreditCard,
  Printer,
  ChevronRight,
  RotateCw,
} from "lucide-react";

function GuestOrderContent() {
  const searchParams = useSearchParams();
  const rawTable = searchParams.get("table") || "1";
  const rawToken = searchParams.get("token") || "";
  const tableNum = parseInt(rawTable, 10);

  const { menu, tables, orders, placeOrder, settleBill } = useCafe();

  const currentTable = tables.find((t) => t.number === tableNum);

  // Active view: "menu" | "cart" | "tracker" | "receipt"
  const [activeTab, setActiveTab] = useState<"menu" | "tracker" | "receipt">("menu");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Customization modal local state
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [itemNote, setItemNote] = useState("");

  // Cart local state
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Payment modal state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"RAZORPAY" | "UPI" | "CASH">("RAZORPAY");
  const [isPaying, setIsPaying] = useState(false);
  const [settledInvoice, setSettledInvoice] = useState<{
    invoiceNumber: string;
    grandTotal: number;
    paymentMethod: string;
    paidAt: string;
  } | null>(null);

  // Active orders placed for this specific table
  const tableOrders = useMemo(() => {
    return orders.filter((o) => o.tableNumber === tableNum);
  }, [orders, tableNum]);

  const activeOrder = tableOrders[0]; // Most recent order

  // Dietary filter helper
  const categories = ["All", "Indian", "Tandoor", "Chinese", "Continental", "Brews"];

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      if (selectedCategory === "All") return true;
      return item.category === selectedCategory;
    });
  }, [menu, selectedCategory]);

  // Open item customizer or directly add if no add-on groups
  const handleItemClick = (item: MenuItem) => {
    if (!item.isAvailable) return;

    if (item.addonGroups && item.addonGroups.length > 0) {
      setCustomizingItem(item);
      // Pre-select defaults
      const defaults: SelectedAddon[] = [];
      item.addonGroups.forEach((grp) => {
        const defOpt = grp.options.find((o) => o.isDefault);
        if (defOpt) {
          defaults.push({ id: defOpt.id, name: `${grp.name}: ${defOpt.name}`, price: defOpt.price });
        }
      });
      setSelectedAddons(defaults);
      setItemNote("");
    } else {
      addToCartDirect(item);
    }
  };

  const addToCartDirect = (item: MenuItem, addons: SelectedAddon[] = [], note = "") => {
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = item.price + addonsTotal;

    const existingIndex = cart.findIndex(
      (c) =>
        c.menuItemId === item.id &&
        JSON.stringify(c.addons || []) === JSON.stringify(addons) &&
        (c.notes || "") === note
    );

    if (existingIndex > -1) {
      setCart((prev) => {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      });
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          menuItemId: item.id,
          name: item.name,
          price: unitPrice,
          quantity: 1,
          addons,
          notes: note,
        },
      ]);
    }
  };

  const confirmCustomization = () => {
    if (!customizingItem) return;
    addToCartDirect(customizingItem, selectedAddons, itemNote);
    setCustomizingItem(null);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartGst = Math.round(cartSubtotal * 0.05 * 100) / 100;
  const cartTotal = cartSubtotal + cartGst;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setOrderError(null);

    const res = await placeOrder({
      tableNumber: tableNum,
      token: rawToken || currentTable?.token,
      items: cart,
      specialInstructions,
      customerName,
      customerPhone,
    });

    setIsSubmitting(false);

    if (res.success) {
      setCart([]);
      setIsCartOpen(false);
      setActiveTab("tracker");
    } else {
      setOrderError(res.error || "Failed to place order.");
    }
  };

  const handleSettleBill = async () => {
    if (!activeOrder) return;
    setIsPaying(true);

    const bill = await settleBill({
      orderId: activeOrder.id,
      tableNumber: tableNum,
      paymentMethod: selectedPaymentMethod,
      paymentRefId: selectedPaymentMethod === "RAZORPAY" ? `pay_rzp_${Date.now()}` : `UPI_${Date.now()}`,
    });

    setIsPaying(false);
    setIsPayModalOpen(false);

    if (bill) {
      setSettledInvoice(bill);
      setActiveTab("receipt");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf2] pb-28 text-garden-950 max-w-md mx-auto relative shadow-2xl">
      {/* Brand & Table Header */}
      <header className="sticky top-0 z-30 bg-garden-950 text-stone-100 px-4 py-3 border-b border-gold-400/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-400 bg-black shadow-sm flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.jpg" alt="Swade Allade Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wide text-gold-300">স্বাদে আহ্লাদে ক্যাফেটেরিয়া</div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white">Table #{tableNum}</h1>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-garden-800 text-emerald-200 border border-garden-700">
                {currentTable?.zone || "Garden Seat"}
              </span>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-1 text-[10px] font-semibold bg-garden-900 text-emerald-300 border border-garden-700 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified</span>
        </div>
      </header>

      {/* Navigation Tabs (Menu / Live Tracker / Bill) */}
      <div className="bg-white border-b border-garden-200 px-4 py-2 flex items-center justify-between sticky top-[64px] z-20">
        <div className="flex gap-2 w-full">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === "menu" ? "bg-garden-800 text-gold-300 shadow-sm" : "text-stone-600 hover:bg-garden-50"
            }`}
          >
            Menu & Order
          </button>
          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "tracker" ? "bg-garden-800 text-gold-300 shadow-sm" : "text-stone-600 hover:bg-garden-50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Tracker ({tableOrders.length})</span>
          </button>
          {activeOrder && (
            <button
              onClick={() => setActiveTab("receipt")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === "receipt" ? "bg-garden-800 text-gold-300 shadow-sm" : "text-stone-600 hover:bg-garden-50"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Bill</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MENU & ORDERING */}
      {/* ======================================================== */}
      {activeTab === "menu" && (
        <div>
          {/* Category Horizontal Filter */}
          <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar bg-[#fcfaf2] sticky top-[109px] z-10 border-b border-garden-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-garden-800 text-gold-300 border border-gold-400 shadow-sm"
                    : "bg-white text-garden-900 border border-garden-200 hover:bg-garden-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items List */}
          <div className="p-4 space-y-3">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3.5 bg-white rounded-2xl border border-stone-200 shadow-sm transition flex gap-3.5 relative overflow-hidden ${
                  item.isAvailable ? "hover:border-amber-300 cursor-pointer active:scale-[0.99]" : "opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Food Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider">
                      Sold Out
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      {/* Dietary indicator dot */}
                      <span
                        className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
                          item.dietary === "NON_VEG" ? "border-rose-500" : "border-emerald-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.dietary === "NON_VEG" ? "bg-rose-500" : "bg-emerald-600"
                          }`}
                        />
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500 tracking-wide">
                        {item.dietary === "NON_VEG" ? "Non-Veg" : item.dietary === "VEGAN" ? "Vegan" : "Vegetarian"}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[10px] text-stone-500 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {item.prepTime}m
                      </span>
                    </div>

                    <h3 className="font-semibold text-stone-900 text-sm leading-snug">{item.name}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="font-bold text-stone-900 text-sm">₹{item.price}</span>

                    {item.isAvailable ? (
                      <button
                        type="button"
                        className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-rose-600 font-medium">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LIVE ORDER TRACKER */}
      {/* ======================================================== */}
      {activeTab === "tracker" && (
        <div className="p-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Live Order Status for Table #{tableNum}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Synchronized in real-time with the Kitchen Display System (KDS).
            </p>
          </div>

          {tableOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-3">
              <UtensilsCrossed className="w-12 h-12 text-stone-300 mx-auto" />
              <div className="font-semibold text-stone-800 text-sm">No Active Orders Yet</div>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Select your favorite brews and sourdough toasts from the menu to fire your table order!
              </p>
              <button
                onClick={() => setActiveTab("menu")}
                className="mt-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            tableOrders.map((order) => {
              // Stepper stages
              const stages = [
                { key: "PLACED", label: "Order Placed", desc: "Sent to kitchen" },
                { key: "IN_KITCHEN", label: "In Kitchen", desc: "Chef is preparing" },
                { key: "READY_TO_SERVE", label: "Ready to Serve", desc: "Plated & warm" },
                { key: "SERVED", label: "Delivered", desc: "Served at Table" },
              ];

              const currentStageIndex = stages.findIndex((s) => s.key === order.status);

              return (
                <div key={order.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-start border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                        Ticket #{order.orderNumber}
                      </span>
                      <div className="text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {order.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Visual Stepper */}
                  <div className="space-y-3 py-1">
                    {stages.map((stage, idx) => {
                      const isComplete = currentStageIndex >= idx;
                      const isCurrent = currentStageIndex === idx;

                      return (
                        <div key={stage.key} className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isComplete
                                ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                                : "bg-stone-200 text-stone-500"
                            }`}
                          >
                            {isComplete ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className={`text-xs font-bold ${isCurrent ? "text-amber-800 font-extrabold" : "text-stone-800"}`}>
                              {stage.label} {isCurrent && <span className="animate-pulse">⏳</span>}
                            </div>
                            <div className="text-[11px] text-stone-500">{stage.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order items recap */}
                  <div className="bg-stone-50 p-3 rounded-xl space-y-1.5 border border-stone-100 text-xs">
                    <div className="font-semibold text-stone-700 text-[11px] uppercase tracking-wider">Line Items:</div>
                    {order.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-stone-700">
                        <span>
                          {it.quantity}x {it.name}
                        </span>
                        <span className="font-medium">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-stone-200 pt-1.5 mt-1 flex justify-between font-bold text-stone-900">
                      <span>Total (incl. 5% GST):</span>
                      <span className="text-amber-800">₹{order.total}</span>
                    </div>
                  </div>

                  {/* Bill button */}
                  {order.paymentStatus === "PENDING" && (
                    <button
                      onClick={() => {
                        setIsPayModalOpen(true);
                      }}
                      className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Request Bill & Pay Online (₹{order.total})</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: DIGITAL BILL & INVOICE */}
      {/* ======================================================== */}
      {activeTab === "receipt" && activeOrder && (
        <div className="p-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-lg text-center space-y-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400 mx-auto bg-black shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.jpg" alt="Swade Allade Logo" className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-garden-700">Tax Invoice / Receipt</div>
              <h2 className="text-lg font-bold text-garden-950">স্বাদে আহ্লাদে ক্যাফেটেরিয়া</h2>
              <p className="text-xs text-stone-500">Swade Allade • Table #{tableNum} • www.swadeallade.com</p>
            </div>

            <div className="border-t border-b border-dashed border-stone-200 py-3 text-left space-y-2 text-xs">
              {activeOrder.items.map((it) => (
                <div key={it.id} className="flex justify-between">
                  <span className="text-stone-700">
                    {it.quantity}x {it.name}
                  </span>
                  <span className="font-semibold text-stone-900">₹{it.price * it.quantity}</span>
                </div>
              ))}

              <div className="border-t border-stone-100 pt-2 space-y-1">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal:</span>
                  <span>₹{activeOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>CGST (2.5%) + SGST (2.5%):</span>
                  <span>₹{activeOrder.gst}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-900 pt-1">
                  <span>Grand Total:</span>
                  <span className="text-amber-800">₹{activeOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  activeOrder.paymentStatus === "PAID"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {activeOrder.paymentStatus === "PAID" ? "PAID & SETTLED" : "PAYMENT PENDING"}
              </span>
            </div>

            {activeOrder.paymentStatus !== "PAID" ? (
              <button
                onClick={() => setIsPayModalOpen(true)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow transition"
              >
                Pay Now (Razorpay / UPI / Cash)
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Payment Complete. Thank you for dining with us!</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FLOATING CART BAR (WHEN CART HAS ITEMS) */}
      {/* ======================================================== */}
      {cart.length > 0 && activeTab === "menu" && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-40">
          <div className="bg-garden-950 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-gold-400/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-garden-700 border border-gold-400/40 flex items-center justify-center relative">
                <ShoppingBag className="w-5 h-5 text-gold-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-crimson-600 border border-gold-300 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              </div>
              <div>
                <div className="text-xs text-emerald-200">Total (incl. GST)</div>
                <div className="text-base font-extrabold text-gold-300">₹{cartTotal.toFixed(2)}</div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-garden-950 rounded-xl text-xs font-extrabold transition flex items-center gap-1 shadow-md"
            >
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CART DRAWER / SHEET */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-stone-900">Your Table #{tableNum} Order</h3>
                <span className="text-xs text-stone-500">
                  {cart.reduce((a, b) => a + b.quantity, 0)} items in tray
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {cart.map((item) => (
                <div key={item.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-xs text-stone-900">{item.name}</h4>
                    {item.addons && item.addons.length > 0 && (
                      <div className="text-[11px] text-stone-500">
                        {item.addons.map((a) => a.name).join(", ")}
                      </div>
                    )}
                    {item.notes && <div className="text-[11px] text-amber-700 italic">Note: &ldquo;{item.notes}&rdquo;</div>}
                    <div className="text-xs font-bold text-stone-900 mt-1">₹{item.price * item.quantity}</div>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-lg p-1">
                    <button
                      onClick={() => updateCartQty(item.id, -1)}
                      className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.id, 1)}
                      className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Patron & Loyalty Phone capture */}
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 space-y-2 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Earn 5% Loyalty Cashback</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-amber-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="tel"
                      placeholder="Phone (for points)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-amber-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Special Cooking Instructions */}
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  Special Cooking Instructions (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less ice, extra hot, dressing on side"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              {/* Cost summary breakdown */}
              <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cafe GST (5%):</span>
                  <span>₹{cartGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-stone-900 pt-1 border-t border-stone-100">
                  <span>Grand Total:</span>
                  <span className="text-amber-800">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {orderError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{orderError}</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50">
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting to Kitchen...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Send to Kitchen (₹{cartTotal.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ITEM CUSTOMIZER MODAL */}
      {/* ======================================================== */}
      {customizingItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl p-4">
            <div className="flex justify-between items-start border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">{customizingItem.name}</h3>
                <span className="text-xs text-stone-500 font-semibold">Base Price: ₹{customizingItem.price}</span>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1">
              {customizingItem.addonGroups?.map((group) => (
                <div key={group.id} className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">{group.name}</h4>
                  <div className="space-y-1.5">
                    {group.options.map((option) => {
                      const isSelected = selectedAddons.some((a) => a.id === option.id);
                      return (
                        <label
                          key={option.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs transition ${
                            isSelected
                              ? "bg-amber-50 border-amber-500 font-semibold text-amber-900"
                              : "bg-white border-stone-200 text-stone-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={group.id}
                              checked={isSelected}
                              onChange={() => {
                                // Replace existing choice for this group
                                const filtered = selectedAddons.filter(
                                  (a) => !group.options.some((opt) => opt.id === a.id)
                                );
                                setSelectedAddons([
                                  ...filtered,
                                  { id: option.id, name: `${group.name}: ${option.name}`, price: option.price },
                                ]);
                              }}
                              className="text-amber-600 focus:ring-amber-500"
                            />
                            <span>{option.name}</span>
                          </div>
                          <span className="font-medium text-stone-500">
                            {option.price > 0 ? `+₹${option.price}` : "Included"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div>
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1">
                  Item Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra hot, no foam"
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <button
              onClick={confirmCustomization}
              className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-sm shadow transition mt-2"
            >
              Add to Tray • ₹
              {customizingItem.price + selectedAddons.reduce((acc, curr) => acc + curr.price, 0)}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* RAZORPAY / UPI / CASH MOCK PAYMENT MODAL */}
      {/* ======================================================== */}
      {isPayModalOpen && activeOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-sm">Settlement & Payment</h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2">
              <span className="text-xs text-stone-500">Amount Due for Table #{tableNum}</span>
              <div className="text-3xl font-extrabold text-stone-900 mt-1">₹{activeOrder.total}</div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">Choose Payment Method:</label>

              {[
                { id: "RAZORPAY", label: "Razorpay (UPI / Cards / Netbanking)" },
                { id: "UPI", label: "Direct UPI QR (GPay / PhonePe / Paytm)" },
                { id: "CASH", label: "Cash to Waitstaff" },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                    selectedPaymentMethod === m.id
                      ? "bg-amber-50 border-amber-600 text-amber-900 font-bold"
                      : "bg-white border-stone-200 text-stone-700"
                  }`}
                >
                  <span>{m.label}</span>
                  <input
                    type="radio"
                    name="payMethod"
                    checked={selectedPaymentMethod === m.id}
                    onChange={() => setSelectedPaymentMethod(m.id as "RAZORPAY" | "UPI" | "CASH")}
                    className="text-amber-600"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={handleSettleBill}
              disabled={isPaying}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow transition flex items-center justify-center gap-2"
            >
              {isPaying ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Confirm & Pay ₹{activeOrder.total}</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuestOrderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading Table Session...</div>}>
      <GuestOrderContent />
    </Suspense>
  );
}


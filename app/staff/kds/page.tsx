"use client";

import React, { useState, useEffect } from "react";
import { useCafe } from "@/lib/cafe-context";
import { Order, OrderStatus } from "@/lib/data-store";
import { playOrderChime } from "@/lib/audio-chime";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ChevronRight,
  Flame,
  Check,
  X,
  Filter,
  RefreshCw,
} from "lucide-react";

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus, refreshState } = useCafe();
  const [selectedZone, setSelectedZone] = useState<string>("All");
  const [, setTicker] = useState<number>(0);

  // Timer refresh every 10 seconds to update ticket elapsed times
  useEffect(() => {
    const timer = setInterval(() => setTicker((t) => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedTime = (isoString: string) => {
    const elapsedMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(elapsedMs / 60000);
    return mins;
  };

  const columns: {
    status: OrderStatus;
    title: string;
    headerColor: string;
    borderTop: string;
    badgeBg: string;
  }[] = [
    {
      status: "PLACED",
      title: "New Orders",
      headerColor: "text-amber-400",
      borderTop: "border-amber-500",
      badgeBg: "bg-amber-950/80 text-amber-300 border-amber-800",
    },
    {
      status: "IN_KITCHEN",
      title: "In Kitchen (Cooking)",
      headerColor: "text-orange-400",
      borderTop: "border-orange-500",
      badgeBg: "bg-orange-950/80 text-orange-300 border-orange-800",
    },
    {
      status: "READY_TO_SERVE",
      title: "Ready to Serve",
      headerColor: "text-emerald-400",
      borderTop: "border-emerald-500",
      badgeBg: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
    },
    {
      status: "SERVED",
      title: "Completed / Served",
      headerColor: "text-stone-400",
      borderTop: "border-stone-600",
      badgeBg: "bg-stone-800 text-stone-300 border-stone-700",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* KDS Kitchen Header Bar */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">Kitchen Display System (KDS)</h1>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-stone-400">Live ticket queue synchronized with guest QR orders</p>
          </div>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-3">
          {/* Test Audio Chime */}
          <button
            onClick={() => playOrderChime()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 border border-stone-700 transition"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Test Kitchen Chime</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => refreshState()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 border border-stone-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* Main Kanban Board */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[1100px]">
          {columns.map((col) => {
            const columnOrders = orders.filter((o) => o.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-stone-900/90 rounded-2xl border border-stone-800 flex flex-col max-h-[calc(100vh-140px)] shadow-xl"
              >
                {/* Column Header */}
                <div className={`p-4 border-b border-stone-800 border-t-4 ${col.borderTop} flex justify-between items-center rounded-t-2xl`}>
                  <div className="flex items-center gap-2">
                    <h2 className={`font-black text-sm uppercase tracking-wider ${col.headerColor}`}>
                      {col.title}
                    </h2>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.badgeBg}`}>
                    {columnOrders.length}
                  </span>
                </div>

                {/* Orders Column Body */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1">
                  {columnOrders.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-xs text-stone-600 font-medium">
                      No tickets in this stage
                    </div>
                  ) : (
                    columnOrders.map((order) => {
                      const mins = getElapsedTime(order.createdAt);
                      const isUrgent = mins > 12;

                      return (
                        <div
                          key={order.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isUrgent && col.status !== "SERVED"
                              ? "bg-rose-950/20 border-rose-800/80 shadow-lg"
                              : "bg-stone-800/90 border-stone-700/80 hover:border-stone-600"
                          }`}
                        >
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-3 border-b border-stone-700/60 pb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-base font-black text-white">Table #{order.tableNumber}</span>
                                <span className="text-[11px] font-bold text-stone-400">#{order.orderNumber}</span>
                              </div>
                              <div className="text-[11px] text-stone-400">
                                {order.customerName ? `${order.customerName} • ` : ""}
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>

                            <div
                              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                                isUrgent && col.status !== "SERVED"
                                  ? "bg-rose-900/60 text-rose-300 border border-rose-700 animate-pulse"
                                  : "bg-stone-700 text-stone-300"
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              <span>{mins}m ago</span>
                            </div>
                          </div>

                          {/* Line items list */}
                          <div className="space-y-2 mb-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="text-xs">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-black text-amber-400 text-sm">{item.quantity}x</span>
                                  <span className="font-bold text-stone-100">{item.name}</span>
                                </div>

                                {item.addons && item.addons.length > 0 && (
                                  <div className="pl-6 text-[11px] text-stone-400">
                                    {item.addons.map((a) => a.name).join(" • ")}
                                  </div>
                                )}

                                {item.notes && (
                                  <div className="mt-0.5 pl-6 text-[11px] font-medium text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/60">
                                    Note: &ldquo;{item.notes}&rdquo;
                                  </div>
                                )}
                              </div>
                            ))}

                            {order.specialInstructions && (
                              <div className="mt-2 text-[11px] bg-rose-950/40 border border-rose-800/60 text-rose-300 p-2 rounded-lg font-medium">
                                Table Instruction: {order.specialInstructions}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-stone-700/60 flex items-center gap-2">
                            {col.status === "PLACED" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "IN_KITCHEN")}
                                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                              >
                                <Flame className="w-3.5 h-3.5" />
                                <span>Accept & Start Cooking</span>
                              </button>
                            )}

                            {col.status === "IN_KITCHEN" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "READY_TO_SERVE")}
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Ready to Serve</span>
                              </button>
                            )}

                            {col.status === "READY_TO_SERVE" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "SERVED")}
                                className="w-full py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Delivered to Table</span>
                              </button>
                            )}

                            {col.status === "SERVED" && (
                              <div className="w-full text-center py-1 text-[11px] text-stone-500 font-semibold">
                                Fulfilled • {order.paymentStatus === "PAID" ? "Settled" : "Bill Open"}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}


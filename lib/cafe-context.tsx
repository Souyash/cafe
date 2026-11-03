"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { MenuItem, CafeTable, Order, Customer, BillInvoice, OrderStatus } from "./data-store";
import { playOrderChime } from "./audio-chime";

interface CafeState {
  menu: MenuItem[];
  tables: (CafeTable & { token: string })[];
  orders: Order[];
  customers: Customer[];
  bills: BillInvoice[];
  loading: boolean;
  refreshState: () => Promise<void>;
  placeOrder: (payload: {
    tableNumber: number;
    token?: string;
    items: Order["items"];
    specialInstructions?: string;
    customerName?: string;
    customerPhone?: string;
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  toggleMenuStock: (itemId: string) => Promise<boolean>;
  rotateTableQR: (tableNumber: number) => Promise<string | null>;
  settleBill: (payload: {
    orderId: string;
    tableNumber: number;
    paymentMethod: "RAZORPAY" | "UPI" | "CASH" | "CARD";
    paymentRefId?: string;
  }) => Promise<BillInvoice | null>;
}

const CafeContext = createContext<CafeState | null>(null);

export function CafeProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<(CafeTable & { token: string })[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bills, setBills] = useState<BillInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  const prevOrdersCountRef = useRef<number>(0);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/cafe");
      if (res.ok) {
        const data = await res.json();
        setMenu(data.menu || []);
        setTables(data.tables || []);
        setCustomers(data.customers || []);
        setBills(data.bills || []);

        const nextOrders: Order[] = data.orders || [];

        // Check if a new order was placed (trigger chime if count increased)
        if (prevOrdersCountRef.current > 0 && nextOrders.length > prevOrdersCountRef.current) {
          playOrderChime();
        }
        prevOrdersCountRef.current = nextOrders.length;
        setOrders(nextOrders);
      }
    } catch (err) {
      console.error("Failed to load cafe state:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();

    // Setup cross-tab BroadcastChannel for zero-latency instant updates
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("cafe-realtime-bus");
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === "ORDER_PLACED") {
          playOrderChime();
        }
        fetchState();
      };
    }

    // Polling interval fallback for multiple devices
    const interval = setInterval(fetchState, 3500);

    return () => {
      clearInterval(interval);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [fetchState]);

  const notifyBroadcast = (type: string, payload?: unknown) => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type, payload });
    }
  };

  const placeOrder = async (payload: {
    tableNumber: number;
    token?: string;
    items: Order["items"];
    specialInstructions?: string;
    customerName?: string;
    customerPhone?: string;
  }) => {
    try {
      const res = await fetch("/api/cafe/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        notifyBroadcast("ORDER_PLACED", data.order);
        await fetchState();
        return { success: true, order: data.order };
      } else {
        return { success: false, error: data.error || "Order placement failed" };
      }
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistic local update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );

    try {
      const res = await fetch("/api/cafe/order/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        notifyBroadcast("ORDER_STATUS_CHANGED", { orderId, status });
        return true;
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
    await fetchState();
    return false;
  };

  const toggleMenuStock = async (itemId: string) => {
    setMenu((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m))
    );

    try {
      const res = await fetch("/api/cafe/menu/toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      if (res.ok) {
        notifyBroadcast("MENU_UPDATED");
        return true;
      }
    } catch (err) {
      console.error("Toggle stock error:", err);
    }
    return false;
  };

  const rotateTableQR = async (tableNumber: number) => {
    try {
      const res = await fetch("/api/cafe/table/rotate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        notifyBroadcast("TABLE_QR_ROTATED", { tableNumber });
        await fetchState();
        return data.token;
      }
    } catch (err) {
      console.error("Rotate QR error:", err);
    }
    return null;
  };

  const settleBill = async (payload: {
    orderId: string;
    tableNumber: number;
    paymentMethod: "RAZORPAY" | "UPI" | "CASH" | "CARD";
    paymentRefId?: string;
  }) => {
    try {
      const res = await fetch("/api/cafe/bill/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.bill) {
        notifyBroadcast("BILL_SETTLED", data.bill);
        await fetchState();
        return data.bill as BillInvoice;
      }
    } catch (err) {
      console.error("Bill settlement error:", err);
    }
    return null;
  };

  return (
    <CafeContext.Provider
      value={{
        menu,
        tables,
        orders,
        customers,
        bills,
        loading,
        refreshState: fetchState,
        placeOrder,
        updateOrderStatus,
        toggleMenuStock,
        rotateTableQR,
        settleBill,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
}

export function useCafe() {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error("useCafe must be used within a CafeProvider");
  }
  return context;
}


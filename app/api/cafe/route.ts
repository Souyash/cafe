import { NextResponse } from "next/server";
import { cafeStore } from "@/lib/data-store";

export async function GET() {
  // Enrich tables with their dynamic signed QR tokens
  const enrichedTables = cafeStore.tables.map((t) => ({
    ...t,
    token: cafeStore.getTableToken(t.number),
  }));

  return NextResponse.json({
    menu: cafeStore.menu,
    tables: enrichedTables,
    orders: cafeStore.orders,
    customers: cafeStore.customers,
    bills: cafeStore.bills,
  });
}


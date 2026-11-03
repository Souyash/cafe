import { NextRequest, NextResponse } from "next/server";
import { cafeStore } from "@/lib/data-store";
import { verifyTableToken } from "@/lib/qr-crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tableNumber, token, items, specialInstructions, customerName, customerPhone } = body;

    if (!tableNumber || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order parameters" }, { status: 400 });
    }

    const table = cafeStore.getTableByNumber(Number(tableNumber));
    if (!table) {
      return NextResponse.json({ error: "Table does not exist" }, { status: 404 });
    }

    // Validate table security token
    if (token) {
      const verification = verifyTableToken(token, table.secretSalt);
      if (!verification.valid) {
        return NextResponse.json(
          { error: verification.error || "Security token verification failed" },
          { status: 403 }
        );
      }
    }

    const subtotal = items.reduce(
      (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
      0
    );
    const gst = Math.round(subtotal * 0.05 * 100) / 100;
    const discount = 0;
    const total = subtotal + gst - discount;

    const newOrder = cafeStore.addOrder({
      tableNumber: Number(tableNumber),
      tableId: table.id,
      customerName,
      customerPhone,
      status: "PLACED",
      paymentStatus: "PENDING",
      items,
      subtotal,
      gst,
      discount,
      total,
      specialInstructions,
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Failed to place order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


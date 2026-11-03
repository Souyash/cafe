import { NextRequest, NextResponse } from "next/server";
import { cafeStore } from "@/lib/data-store";

export async function POST(req: NextRequest) {
  try {
    const { orderId, tableNumber, paymentMethod, paymentRefId } = await req.json();

    if (!orderId || !tableNumber || !paymentMethod) {
      return NextResponse.json({ error: "Missing required billing parameters" }, { status: 400 });
    }

    const bill = cafeStore.settleBill({
      orderId,
      tableNumber: Number(tableNumber),
      paymentMethod,
      paymentRefId,
    });

    if (!bill) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, bill });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


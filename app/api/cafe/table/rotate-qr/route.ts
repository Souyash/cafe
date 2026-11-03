import { NextRequest, NextResponse } from "next/server";
import { cafeStore } from "@/lib/data-store";

export async function POST(req: NextRequest) {
  try {
    const { tableNumber } = await req.json();
    if (!tableNumber) {
      return NextResponse.json({ error: "Missing tableNumber" }, { status: 400 });
    }

    const newToken = cafeStore.rotateTableToken(Number(tableNumber));
    const table = cafeStore.getTableByNumber(Number(tableNumber));

    return NextResponse.json({ success: true, table, token: newToken });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


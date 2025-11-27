import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: Request, context: { params: { id: string } }) {
  const id = context.params?.id;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  try {
    const orderRef = doc(db, "orders", id);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const orderData = orderSnap.data();
    return NextResponse.json({ status: orderData.status });
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

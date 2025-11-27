import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const ordersSnap = await getDocs(collection(db, "orders"));
    const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const usersSnap = await getDocs(collection(db, "users"));
    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ orders, users });
  } catch (error) {
    console.error("Metrics fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}

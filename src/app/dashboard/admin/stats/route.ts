import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const coll = collection(db, "orders");
    const snapshot = await getCountFromServer(coll);
    return NextResponse.json({ totalOrders: snapshot.data().count });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

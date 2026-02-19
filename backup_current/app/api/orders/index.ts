import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: Request, context: { params: { [key: string]: string } }) {
  const id = context.params?.id || context.params?.slug;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  try {
    const ref = doc(db, "orders", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(snap.data());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: { [key: string]: string } }) {
  const id = context.params?.id || context.params?.slug;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  try {
    const data = await req.json();
    const ref = doc(db, "orders", id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    return NextResponse.json({ message: "Order updated" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
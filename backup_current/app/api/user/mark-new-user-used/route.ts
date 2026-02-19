import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ message: "Missing userId" }, { status: 400 });

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { isNewUser: false });

    return NextResponse.json({ message: "User promo marked as used" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

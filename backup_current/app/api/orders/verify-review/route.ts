import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) initializeApp(firebaseConfig);
const db = getFirestore();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    const email = searchParams.get("email");

    if (!email || !itemId) {
      return NextResponse.json({ canReview: false });
    }

    // Check if user has purchased the item
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userEmail", "==", email),
      where("status", "==", "COMPLETED"),
      where("items", "array-contains", { itemId })
    );

    const snapshot = await getDocs(q);
    const hasPurchased = !snapshot.empty;

    return NextResponse.json({ canReview: hasPurchased });
  } catch (error) {
    console.error("Error verifying review:", error);
    return NextResponse.json({ error: "Server error", canReview: false }, { status: 500 });
  }
}

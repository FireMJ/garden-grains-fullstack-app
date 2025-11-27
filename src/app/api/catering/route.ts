import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const overviewSnap = await getDoc(doc(db, "catering", "overview"));
    const packagesSnap = await getDocs(collection(db, "catering/packages"));

    const overview = overviewSnap.exists() ? overviewSnap.data() : {};
    const packages = packagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ overview, packages });
  } catch (error) {
    console.error("Error fetching catering data:", error);
    return NextResponse.json({ message: "Failed to fetch catering data" }, { status: 500 });
  }
}

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, DocumentData } from "firebase/firestore";

// ✅ Replace with your Firebase config or import from your existing firebase.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};


// Define TypeScript interfaces
interface AddOn {
  name: string;
  price: string | number;
  [key: string]: unknown; // Allow for additional properties
}

interface MenuItem {
  name: string;
  price: string | number;
  addOns?: AddOn[];
  [key: string]: unknown; // Allow for additional properties
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper: parse "R132.75" → 132.75
const parsePrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    const parsed = parseFloat(price.replace(/[^\d.-]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const fixPrices = async (): Promise<void> => {
  try {
    console.log("Starting price migration...");
    
    const menuRef = collection(db, "menuItems"); // 👈 adjust collection name if needed
    const snapshot = await getDocs(menuRef);

    console.log(`Found ${snapshot.size} menu items to process`);

    let fixedCount = 0;
    let addOnsFixedCount = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as MenuItem;
      const updates: Partial<MenuItem> = {};
      let needsUpdate = false;

      // Fix main price
      if (data.price && typeof data.price === "string") {
        const numericPrice = parsePrice(data.price);
        console.log(`Fixing ${data.name}: ${data.price} → ${numericPrice}`);
        updates.price = numericPrice;
        needsUpdate = true;
        fixedCount++;
      }

      // Fix addOns if present
      if (Array.isArray(data.addOns)) {
        const fixedAddOns = data.addOns.map((addOn: AddOn) => ({
          ...addOn,
          price: parsePrice(addOn.price),
        }));
        
        // Check if any addOn prices were actually changed
        const hasChanged = data.addOns.some((addOn, index) => 
          parsePrice(addOn.price) !== fixedAddOns[index].price
        );
        
        if (hasChanged) {
          updates.addOns = fixedAddOns;
          needsUpdate = true;
          addOnsFixedCount += data.addOns.length;
          console.log(`Fixed ${data.addOns.length} add-ons for ${data.name}`);
        }
      }

      // Only update if changes were made
      if (needsUpdate) {
        await updateDoc(doc(db, "menuItems", docSnap.id), updates);
      }
    }

    console.log("✅ Price migration complete!");
    console.log(`Fixed ${fixedCount} main prices and ${addOnsFixedCount} add-on prices`);
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

// Run the migration
fixPrices().catch((err) => {
  console.error("Migration script failed:", err);
  process.exit(1);
});
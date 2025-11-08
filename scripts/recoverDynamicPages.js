import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// --- Initialize Firebase ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Paths ---
const pagesDir = path.join(process.cwd(), 'src', 'app', 'menu'); // adjust to your dynamic page folder

// --- Main Recovery Function ---
async function recoverPages() {
  const menuCol = collection(db, 'menuItems'); // your Firestore collection
  const snapshot = await getDocs(menuCol);

  if (!snapshot.empty) {
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const pageFile = path.join(pagesDir, `${docSnap.id}.tsx`);

      // Create page content
      const content = `
"use client";
import React from "react";
import MenuItemCard from "@/components/MenuItemCard";

export default function ${docSnap.id}() {
  return (
    <div>
      <MenuItemCard
        id="${docSnap.id}"
        name="${data.name}"
        price={${data.price}}
        description={\`${data.description}\`}
        image="${data.imageURL}"
      />
    </div>
  );
}
`;

      // Write or overwrite page file
      fs.writeFileSync(pageFile, content, 'utf8');
      console.log(`✅ Page recovered: ${pageFile}`);
    });
  } else {
    console.log("⚠️ No menu items found in Firestore!");
  }
}

// Run
recoverPages().catch(console.error);

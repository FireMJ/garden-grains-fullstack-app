// example: src/components/PromoBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function PromoBanner() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const colRef = collection(db, "promos"); // <- correct usage
      const snap = await getDocs(colRef);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    load().catch(console.error);
  }, []);

  return (
    <div>{items.map(i => <div key={i.id}>{i.title}</div>)}</div>
  );
}

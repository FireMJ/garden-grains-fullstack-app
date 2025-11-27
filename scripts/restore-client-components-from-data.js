// scripts/restore-client-components-from-data.js
import fs from "fs";
import path from "path";

// ---------------- CONFIG ----------------
const categories = [
  "bowls",
  "breakfast",
  "fries",
  "juices",
  "pastas",
  "salads",
  "smoothies",
  "soups",
  "stirfry",
  "toasties",
  "wraps",
];

const componentsPath = path.join(process.cwd(), "src/components/menu");
const dataPath = path.join(process.cwd(), "src_backup/data");

// Template for each client component
function generateComponentTemplate(category, componentName, dataName) {
  return `\
"use client";

import React from "react";
import { ${dataName} } from "@/data/${dataName}";
import AddOnsData from "@/data/addOns";
import OptionalExtrasData from "@/data/optionalExtras";

export default function ${componentName}({ item, addOns, optionalExtras }: any) {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">{item.name}</h1>
      {item.image && (
        <img src={item.image} alt={item.name} className="w-full max-w-md rounded-lg" />
      )}
      <p className="text-gray-700">{item.description}</p>
      <p className="font-semibold">Price: ${"{item.price}"}</p>

      {addOns && addOns.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Add-Ons</h2>
          <ul className="list-disc list-inside">
            {addOns.map((a: any) => (
              <li key={a.id}>{a.name} (+${"{a.price}"})</li>
            ))}
          </ul>
        </div>
      )}

      {optionalExtras && optionalExtras.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Optional Extras</h2>
          <ul className="list-disc list-inside">
            {optionalExtras.map((o: any) => (
              <li key={o.id}>{o.name} (+${"{o.price}"})</li>
            ))}
          </ul>
        </div>
      )}

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add to Cart
      </button>
    </div>
  );
}
`;
}

// ---------------- SCRIPT ----------------
for (const category of categories) {
  const categoryDir = path.join(componentsPath, category);
  if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });

  const componentName = category
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("") + "DetailClient";

  const dataName = {
    bowls: "bowlsData",
    breakfast: "breakfastBowlsData",
    fries: "friesData",
    juices: "juicesData",
    pastas: "pastasData",
    salads: "saladsData",
    smoothies: "smoothiesData",
    soups: "soupsData",
    "stirfry": "stirFryData",
    toasties: "toastiesData",
    wraps: "wrapsData",
  }[category];

  const componentFile = path.join(categoryDir, `${componentName}.tsx`);
  if (!fs.existsSync(componentFile)) {
    fs.writeFileSync(componentFile, generateComponentTemplate(category, componentName, dataName));
    console.log(`✅ Created: ${componentFile}`);
  } else {
    console.log(`⚠️ Skipped (already exists): ${componentFile}`);
  }
}

console.log("✅ All menu client components generated from data.");

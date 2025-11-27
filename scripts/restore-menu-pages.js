// scripts/restore-menu-pages.js
import fs from "fs";
import path from "path";

// ------------------ CONFIG ------------------
const menuCategories = [
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

const appMenuPath = path.join(process.cwd(), "src/app/menu");

// Mapping category → data file & component
const categoryConfig = {
  bowls: { data: "bowlsData", component: "BowlDetailClient" },
  breakfast: { data: "breakfastBowlsData", component: "BreakfastDetailClient" },
  fries: { data: "friesData", component: "FriesDetailClient" },
  juices: { data: "juicesData", component: "JuiceDetailClient" },
  pastas: { data: "pastasData", component: "PastaDetailClient" },
  salads: { data: "saladsData", component: "SaladDetailClient" },
  smoothies: { data: "smoothiesData", component: "SmoothieDetailClient" },
  soups: { data: "soupsData", component: "SoupDetailClient" },
  stirfry: { data: "stirfryData", component: "StirFryDetailClient" },
  toasties: { data: "toastiesData", component: "ToastieDetailClient" },
  wraps: { data: "wrapsData", component: "WrapDetailClient" },
};

// ------------------ SCRIPT ------------------
for (const category of menuCategories) {
  const categoryPath = path.join(appMenuPath, category);

  // Create category folder if missing
  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
    console.log(`Created folder: ${categoryPath}`);
  }

  // Create [slug] folder
  const slugPath = path.join(categoryPath, "[slug]");
  if (!fs.existsSync(slugPath)) fs.mkdirSync(slugPath);

  // Create page.tsx file
  const pageFile = path.join(slugPath, "page.tsx");

  const { data, component } = categoryConfig[category];

  const pageContent = `"use client";

import { useParams } from "next/navigation";
import ${component} from "@/components/menu/${category}/${component}";
import { ${data} } from "@/src_backup/data/${data}";
import AddOnsData from "@/src_backup/data/addOns";
import OptionalExtrasData from "@/src_backup/data/optionalExtras";

export default function ${component}Page() {
  const params = useParams();
  const item = ${data}.find((i) => i.slug === params.slug);

  if (!item) return <p>Item not found</p>;

  return <${component} item={item} addOns={AddOnsData} optionalExtras={OptionalExtrasData} />;
}
`;

  fs.writeFileSync(pageFile, pageContent);
  console.log(`✅ Restored: ${pageFile}`);
}

console.log("🎉 All menu [slug]/page.tsx files restored from backup.");

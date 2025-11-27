// scripts/restore-client-components.js
import fs from "fs";
import path from "path";

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

const srcPath = path.join(process.cwd(), "src");
const backupPath = path.join(process.cwd(), "src_backup");

const categoryComponents = {
  bowls: "BowlDetailClient.tsx",
  breakfast: "BreakfastDetailClient.tsx",
  fries: "FriesDetailClient.tsx",
  juices: "JuiceDetailClient.tsx",
  pastas: "PastaDetailClient.tsx",
  salads: "SaladDetailClient.tsx",
  smoothies: "SmoothieDetailClient.tsx",
  soups: "SoupDetailClient.tsx",
  stirfry: "StirFryDetailClient.tsx",
  toasties: "ToastieDetailClient.tsx",
  wraps: "WrapDetailClient.tsx",
};

for (const category of menuCategories) {
  const componentName = categoryComponents[category];
  const srcComponentDir = path.join(srcPath, "components", "menu", category);
  const backupComponentFile = path.join(backupPath, "components", "menu", category, componentName);

  // Ensure target directory exists
  if (!fs.existsSync(srcComponentDir)) fs.mkdirSync(srcComponentDir, { recursive: true });

  if (fs.existsSync(backupComponentFile)) {
    const content = fs.readFileSync(backupComponentFile, "utf8");
    const destFile = path.join(srcComponentDir, componentName);
    fs.writeFileSync(destFile, content);
    console.log(`✅ Restored component: ${destFile}`);
  } else {
    console.log(`⚠️ Backup not found for ${componentName}, creating placeholder...`);
    const placeholder = `import React from "react";

export default function ${componentName.replace(".tsx", "")}({ item, addOns, optionalExtras }: any) {
  return <div>{item?.name || "Item name"}</div>;
}
`;
    fs.writeFileSync(path.join(srcComponentDir, componentName), placeholder);
  }
}

console.log("🎉 All menu client components restored or placeholders created.");

// scripts/full-menu-recovery.js
import fs from "fs";
import path from "path";

const baseDir = path.resolve("src/app/menu");
const dataDir = path.resolve("src/data");
const backupDir = path.resolve("src_backup/data");

const categories = [
  "bowls",
  "breakfast",
  "fries",
  "juices",
  "pastas",
  "salads",
  "smoothies",
  "soups",
  "stir-fry",
  "toasties",
  "wraps",
];

console.log("🥗 Starting full menu recovery...\n");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Function to create placeholder data file
function createDataFile(category) {
  const fileName = `${category.replace("-", "")}Data.ts`;
  const filePath = path.join(dataDir, fileName);

  const content = `// Auto-generated placeholder for ${category} menu
export const ${category.replace("-", "")}Data = [
  {
    id: "1",
    name: "${category} Item",
    description: "Delicious ${category} item coming soon.",
    price: 75,
    image: "/images/menu/${category}/placeholder.jpg",
    category: "${category}",
  },
];
`;
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`⚠️ Created placeholder: ${fileName}`);
}

// Function to restore from backup if available
function restoreDataFile(category) {
  const fileName = `${category.replace("-", "")}Data.ts`;
  const backupPath = path.join(backupDir, fileName);
  const dataPath = path.join(dataDir, fileName);

  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, dataPath);
    console.log(`✅ Restored from backup: ${fileName}`);
  } else {
    createDataFile(category);
  }
}

// Function to create missing [slug]/page.tsx file
function createPageFile(category) {
  const categoryDir = path.join(baseDir, category);
  const slugDir = path.join(categoryDir, "[slug]");
  const pagePath = path.join(slugDir, "page.tsx");

  if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });

  if (!fs.existsSync(pagePath)) {
    const dataImport = category.replace("-", "");
    const content = `import { ${dataImport}Data } from "@/src/data/${dataImport}Data";
import MenuItemDetail from "@/components/MenuItemDetail";

export default function ${dataImport.charAt(0).toUpperCase() + dataImport.slice(1)}DetailPage({ params }) {
  const item = ${dataImport}Data.find((i) => i.id === params.slug);
  if (!item) return <div>Item not found.</div>;
  return <MenuItemDetail item={item} />;
}
`;
    fs.writeFileSync(pagePath, content, "utf8");
    console.log(`🧩 Rebuilt page: ${category}/[slug]/page.tsx`);
  }
}

// Run the recovery
for (const category of categories) {
  restoreDataFile(category);
  if (category !== "soups") createPageFile(category); // skip soups since it’s already working
}

console.log("\n✅ Full menu recovery complete!\n");


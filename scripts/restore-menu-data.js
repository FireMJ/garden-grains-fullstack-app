/**
 * 🥗 Garden & Grains – Self-Healing Menu Data Restorer
 * 
 * 1️⃣ If src_backup/data exists → restores real data
 * 2️⃣ If missing → rebuilds category data with sample items
 * 3️⃣ Fixes all imports in menu/[category]/[slug]/page.tsx
 * 4️⃣ Skips soups category (since it’s working fine)
 */

import fs from "fs";
import path from "path";

const projectRoot = path.resolve(process.cwd());
const backupDir = path.join(projectRoot, "src_backup", "data");
const dataDir = path.join(projectRoot, "src", "data");
const menuDir = path.join(projectRoot, "src", "app", "menu");

const categories = [
  "bowls",
  "breakfast",
  "fries",
  "juices",
  "pastas",
  "salads",
  "smoothies",
  "soups", // will be skipped
  "stirfry",
  "toasties",
  "wraps",
];

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const createPlaceholderData = (category) => {
  const itemName = category.charAt(0).toUpperCase() + category.slice(1);
  return `export const ${category}Data = [
  {
    id: "1",
    name: "${itemName} Delight",
    description: "A delicious ${category} made with fresh, plant-based ingredients.",
    price: 95,
    image: "/images/menu/${category}/${category}-1.jpg",
    ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
    category: "${itemName}",
  },
  {
    id: "2",
    name: "${itemName} Classic",
    description: "A hearty and satisfying ${category}.",
    price: 89,
    image: "/images/menu/${category}/${category}-2.jpg",
    ingredients: ["Ingredient A", "Ingredient B"],
    category: "${itemName}",
  },
];\n`;
};

const restoreDataFiles = () => {
  ensureDir(dataDir);

  categories.forEach((category) => {
    const backupFile = path.join(backupDir, `${category}Data.ts`);
    const targetFile = path.join(dataDir, `${category}Data.ts`);

    // Skip soups since it’s working fine
    if (category === "soups") {
      console.log(`🥣 Skipped soupsData.ts (already working)`);
      return;
    }

    if (fs.existsSync(backupFile)) {
      fs.copyFileSync(backupFile, targetFile);
      console.log(`✅ Restored from backup: ${category}Data.ts`);
    } else {
      const placeholder = createPlaceholderData(category);
      fs.writeFileSync(targetFile, placeholder);
      console.log(`⚠️ Backup missing, created placeholder: ${category}Data.ts`);
    }
  });
};

const fixImportsInPages = () => {
  categories.forEach((category) => {
    const pageFile = path.join(menuDir, category, "[slug]", "page.tsx");
    if (!fs.existsSync(pageFile)) return;

    let content = fs.readFileSync(pageFile, "utf8");

    // Replace old imports pointing to src_backup
    content = content.replace(/@\/src_backup\/data\//g, "@/data/");

    fs.writeFileSync(pageFile, content, "utf8");
    console.log(`🔧 Fixed imports for: ${category}/[slug]/page.tsx`);
  });
};

console.log("🛠️ Starting menu data restoration...");
restoreDataFiles();
fixImportsInPages();
console.log("\n🌱 Menu data restored successfully!");

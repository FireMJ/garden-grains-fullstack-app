/**
 * 🌿 Garden & Grains — Intelligent Menu Data Rebuilder
 *
 * Extracts real menu item arrays from existing page.tsx files and data files.
 * Reconstructs /src/data/[category]Data.ts with full content when available.
 * Keeps soups untouched and rebuilds missing files intelligently.
 */

import fs from "fs";
import path from "path";

const root = process.cwd();
const menuDir = path.join(root, "src", "app", "menu");
const dataDir = path.join(root, "src", "data");

const categories = [
  "bowls",
  "breakfast",
  "fries",
  "juices",
  "pastas",
  "salads",
  "smoothies",
  "soups", // skip rebuilding
  "stirfry",
  "toasties",
  "wraps",
];

// Helper — ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Extract array-like structures from TSX
function extractDataArray(content, category) {
  const regex = new RegExp(`const\\s+${category}Data\\s*=\\s*(\\[[\\s\\S]*?\\]);`);
  const match = content.match(regex);
  return match ? match[1] : null;
}

// Fallback: create placeholder data
function createPlaceholderData(category) {
  const itemName = category.charAt(0).toUpperCase() + category.slice(1);
  return `export const ${category}Data = [
  {
    id: "1",
    name: "${itemName} Special",
    description: "Fresh, healthy ${category} made with wholesome ingredients.",
    price: 95,
    image: "/images/menu/${category}/${category}-1.jpg",
    ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
    category: "${itemName}",
  },
];\n`;
}

// Try to rebuild each category
function rebuildCategory(category) {
  const categoryDir = path.join(menuDir, category);
  const slugDir = path.join(categoryDir, "[slug]");
  const pageFile = path.join(slugDir, "page.tsx");
  const targetFile = path.join(dataDir, `${category}Data.ts`);

  // Skip soups (working fine)
  if (category === "soups") {
    console.log(`🥣 Skipped soups (unchanged)`);
    return;
  }

  let extractedArray = null;
  if (fs.existsSync(pageFile)) {
    const content = fs.readFileSync(pageFile, "utf8");
    extractedArray = extractDataArray(content, category);
  }

  if (!extractedArray && fs.existsSync(targetFile)) {
    // Maybe an existing valid file already
    console.log(`✅ Existing data file kept for ${category}`);
    return;
  }

  if (extractedArray) {
    const fileContent = `export const ${category}Data = ${extractedArray};\n`;
    fs.writeFileSync(targetFile, fileContent, "utf8");
    console.log(`✅ Extracted real data from page.tsx for ${category}`);
  } else {
    const placeholder = createPlaceholderData(category);
    fs.writeFileSync(targetFile, placeholder, "utf8");
    console.log(`⚠️ No real data found — created placeholder for ${category}`);
  }
}

function main() {
  console.log("🧠 Rebuilding menu data intelligently from pages...");
  ensureDir(dataDir);
  categories.forEach(rebuildCategory);
  console.log("\n🌱 Menu data rebuild complete!");
}

main();

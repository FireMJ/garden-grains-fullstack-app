/**
 * 🌿 Garden & Grains — Full Menu Recovery Script
 * ------------------------------------------------
 * 1️⃣ Rebuilds src/data/[category]Data.ts (from backup or placeholder)
 * 2️⃣ Rebuilds src/data/menuData.ts for home menu grid
 * 3️⃣ Fixes imports in src/app/menu/[category]/page.tsx
 */

import fs from "fs";
import path from "path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const backupDir = path.join(root, "src_backup", "data");
const menuDir = path.join(root, "src", "app", "menu");

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

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function extractArrayFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const arrayRegex = /(export\s+const|const)\s+([A-Za-z0-9_]+)\s*=\s*(\[[\s\S]*?\]);/;
  const match = content.match(arrayRegex);
  return match ? match[3] : null;
}

function createPlaceholder(category) {
  const name = category.charAt(0).toUpperCase() + category.slice(1);
  return `[{
    id: "${category}-1",
    name: "${name} Special",
    description: "A delicious ${name} option prepared fresh daily.",
    price: 95,
    image: "/images/${category}/${category}-1.jpg",
    category: "${name}"
  }]`;
}

function recoverDataFile(category) {
  const outFile = path.join(dataDir, `${category}Data.ts`);
  if (category === "soups") {
    console.log(`🥣 Skipped soups (already working)`);
    return;
  }

  const candidates = [
    path.join(backupDir, `${category}Data.ts`),
    path.join(backupDir, `${category}sData.ts`),
  ];

  let recovered = null;
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      recovered = extractArrayFromFile(file);
      if (recovered) break;
    }
  }

  const finalData = recovered || createPlaceholder(category);
  fs.writeFileSync(outFile, `export const ${category}Data = ${finalData};\n`, "utf8");

  console.log(recovered ? `✅ Recovered real data for ${category}` : `⚠️ Created placeholder for ${category}`);
}

function rebuildMenuData() {
  console.log("\n📦 Rebuilding menuData.ts ...");
  const imports = categories
    .map((c) => `import { ${c}Data } from "./${c}Data";`)
    .join("\n");

  const exportArray = `export const menuData = [
${categories
  .map(
    (c) =>
      `  {
    id: "${c}",
    title: "${c.charAt(0).toUpperCase() + c.slice(1)}",
    slug: "/menu/${c}",
    items: ${c}Data,
  }`
  )
  .join(",\n")}
];`;

  const content = `${imports}\n\n${exportArray}\n`;
  fs.writeFileSync(path.join(dataDir, "menuData.ts"), content, "utf8");
  console.log("✅ menuData.ts rebuilt successfully.");
}

function fixPageImports() {
  console.log("\n🔧 Fixing imports in page.tsx files...");
  for (const category of categories) {
    const pageFile = path.join(menuDir, category, "[slug]", "page.tsx");
    if (!fs.existsSync(pageFile)) continue;

    let content = fs.readFileSync(pageFile, "utf8");
    content = content.replace(
      /from\s+["']@\/src_backup\/data\/.*?["']/g,
      `from "@/data/${category}Data"`
    );

    fs.writeFileSync(pageFile, content, "utf8");
    console.log(`🔹 Fixed import for ${category}/[slug]/page.tsx`);
  }
}

function run() {
  console.log("🌱 Starting FULL menu recovery...\n");
  ensureDir(dataDir);
  categories.forEach(recoverDataFile);
  rebuildMenuData();
  fixPageImports();
  console.log("\n🌿 All menu data and pages restored successfully!\n");
}

run();


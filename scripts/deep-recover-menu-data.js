/**
 * 🌿 Garden & Grains Deep Menu Data Recovery Script
 * 
 * Scans src_backup/data and src/components/menu recursively.
 * Extracts all arrays that look like menu data and rebuilds
 * src/data/[category]Data.ts with the recovered content.
 */

import fs from "fs";
import path from "path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const backupDir = path.join(root, "src_backup", "data");
const componentsDir = path.join(root, "src", "components", "menu");

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

function findMatchingBackup(category) {
  const candidates = [
    path.join(backupDir, `${category}Data.ts`),
    path.join(backupDir, `${category}sData.ts`),
    path.join(componentsDir, category, `${category.charAt(0).toUpperCase() + category.slice(1)}DetailClient.tsx`)
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const dataArray = extractArrayFromFile(file);
      if (dataArray) return dataArray;
    }
  }
  return null;
}

function createPlaceholder(category) {
  const name = category.charAt(0).toUpperCase() + category.slice(1);
  return `[{
    id: "1",
    name: "${name} Special",
    description: "A fresh ${category} option with healthy ingredients.",
    price: 95,
    image: "/images/menu/${category}/${category}-1.jpg",
    category: "${name}",
  }]`;
}

function rebuildData() {
  console.log("🌱 Starting deep menu data recovery...\n");
  ensureDir(dataDir);

  for (const category of categories) {
    const outFile = path.join(dataDir, `${category}Data.ts`);
    if (category === "soups") {
      console.log(`🥣 Skipped soups (already working)`);
      continue;
    }

    const recovered = findMatchingBackup(category);
    const dataArray = recovered || createPlaceholder(category);
    const fileContent = `export const ${category}Data = ${dataArray};\n`;

    fs.writeFileSync(outFile, fileContent, "utf8");
    console.log(recovered ? `✅ Recovered real data for ${category}` : `⚠️ Created placeholder for ${category}`);
  }

  console.log("\n🌿 Deep recovery complete. All data files rebuilt in src/data/");
}

rebuildData();

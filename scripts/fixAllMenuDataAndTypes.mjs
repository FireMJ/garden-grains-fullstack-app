// scripts/fixAllMenuDataAndTypes.mjs
import fs from "fs";
import path from "path";

const dataDir = path.resolve("src/data");

const menuFiles = [
  "breakfastBowlsData.ts",
  "saladsData.ts",
  "bowlsData.ts",
  "stirfryData.ts",
  "friesData.ts",
  "wrapsData.ts",
  "smoothiesData.ts",
  "juicesData.ts",
  "soupsData.ts",
  "pastasData.ts",
  "toastiesData.ts"
];

// Fix IDs and adjust TypeScript type annotations
function fixContent(content, prefix) {
  let counter = 1;

  // Replace all id values
  let fixedContent = content.replace(/id:\s*"(.*?)"/g, () => {
    const newId = `${prefix}-${counter}`;
    counter++;
    return `id: "${newId}"`;
  });

  // Adjust array type annotations if present
  fixedContent = fixedContent.replace(
    /export const (\w+)\s*:\s*(\w+)\[\]/g,
    (match, varName, typeName) => {
      const newTypeName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      return `export const ${varName}: ${newTypeName}[]`;
    }
  );

  return fixedContent;
}

// Create backup with timestamp
function backupFile(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `${filePath}.${timestamp}.bak`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`📦 Backup created: ${backupPath}`);
}

async function main() {
  for (const file of menuFiles) {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      continue;
    }

    backupFile(filePath);

    const content = fs.readFileSync(filePath, "utf-8");
    const prefix = file.replace(/Data\.ts$/, "").replace(/s$/, "").toLowerCase();

    const fixedContent = fixContent(content, prefix);
    fs.writeFileSync(filePath, fixedContent, "utf-8");
    console.log(`✅ Fixed IDs and types in ${file}`);
  }
  console.log("🎉 All menu data files processed successfully!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

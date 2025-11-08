// scripts/fixAllIds.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your data folder
const DATA_DIR = path.join(__dirname, "../src_backup/data");

// Recursively get all .ts files in folder
function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else if (file.endsWith(".ts")) {
      results.push(filePath);
    }
  });
  return results;
}

function fixIdsInContent(content) {
  // 1️⃣ Fix top-level interface or type declarations: id: "literal";
  content = content.replace(/id:\s*".*?";/g, "id: string;");

  // 2️⃣ Fix nested object arrays, e.g., addOns, friesUpsell, juiceUpsell
  content = content.replace(/id:\s*['"`][^'"`]+['"`]/g, "id: string");

  return content;
}

function fixIdsInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Backup original
  fs.writeFileSync(filePath + ".bak", content, "utf-8");

  // Fix IDs
  const fixed = fixIdsInContent(content);

  fs.writeFileSync(filePath, fixed, "utf-8");
  console.log(`✅ Fixed IDs in: ${filePath}`);
}

const files = getAllFiles(DATA_DIR);
files.forEach(fixIdsInFile);

console.log(`\n🎉 Done! Fixed IDs in ${files.length} files. Backups saved with .bak extension.`);

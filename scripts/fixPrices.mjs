import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, "../src_backup/data");

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) results = results.concat(getAllFiles(fullPath));
    else if (file.name.endsWith(".ts")) results.push(fullPath);
  }
  return results;
}

function fixPrices(content) {
  return content.replace(/price:\s*\d+(\.\d+)?/g, "price: number");
}

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  fs.writeFileSync(filePath + ".bak", content, "utf-8");
  fs.writeFileSync(filePath, fixPrices(content), "utf-8");
  console.log(`✅ Fixed prices in: ${filePath}`);
}

getAllFiles(DATA_DIR).forEach(fixFile);
console.log("\n🎉 Done! Prices fixed in all files.");

// scripts/fixMenuTypes.js
const fs = require("fs");
const path = require("path");

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

// Fix all id properties in content
function fixIdsInContent(content) {
  // 1️⃣ Replace all id literal assignments with id: string
  content = content.replace(/id:\s*['"`][^'"`]+['"`]/g, "id: string");

  // 2️⃣ Replace interface/type id fields to string
  // Matches lines like: id: "salad-1";
  content = content.replace(/id:\s*["'][^"']+["'];/g, "id: string;");

  return content;
}

// Main function for each file
function fixIdsAndTypes(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Backup original file
  fs.writeFileSync(filePath + ".bak", content, "utf-8");

  // Fix content
  const fixedContent = fixIdsInContent(content);

  fs.writeFileSync(filePath, fixedContent, "utf-8");
  console.log(`✅ Fixed IDs/types in: ${filePath}`);
}

// Run
const files = getAllFiles(DATA_DIR);
files.forEach(fixIdsAndTypes);

console.log(`\n🎉 Done! Fixed IDs/types in ${files.length} files. Backups saved with .bak extension.`);

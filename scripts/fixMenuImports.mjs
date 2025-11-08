// scripts/fixMenuImports.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_DIR = path.join(__dirname, "../src_backup/app");
const COMPONENTS_DIR = path.join(__dirname, "../src_backup/components");

// Recursively get all .ts/.tsx files
function getAllFiles(dir, exts = [".ts", ".tsx"]) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, exts));
    } else if (exts.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

// Fix imports/types
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  // Backup
  fs.writeFileSync(filePath + ".bak", content, "utf-8");

  // Fix id types
  content = content.replace(/id:\s*["'][^"']+["']/g, "id: string");
  content = content.replace(/as\s*["'][^"']+["']/g, "as string");
  content = content.replace(/extends\s*["'][^"']+["']/g, "extends string");

  // Fix literal types in interfaces/types
  content = content.replace(/(interface|type)\s+([A-Za-z0-9_]+)\s*{[^}]*}/gs, match => {
    return match.replace(/id:\s*["'][^"']+["']/g, "id: string");
  });

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✅ Fixed: ${filePath}`);
}

const appFiles = getAllFiles(APP_DIR);
const compFiles = getAllFiles(COMPONENTS_DIR);

[...appFiles, ...compFiles].forEach(fixImports);

console.log(`\n🎉 Done! Fixed ${appFiles.length + compFiles.length} files. Backups saved with .bak`);

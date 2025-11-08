import fs from "fs";
import path from "path";

// Directory containing your components
const COMPONENTS_DIR = path.join(process.cwd(), "src", "components");

// Recursively get all .tsx files
function getTSXFiles(dir) {
  const files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getTSXFiles(fullPath));
    } else if (file.endsWith(".tsx")) {
      files.push(fullPath);
    }
  }
  return files;
}

// Add default export if missing
function ensureDefaultExport(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Skip if already has default export
  if (/export\s+default\s+/m.test(content)) return;

  // Attempt to detect main component name
  const match = content.match(
    /(?:export\s+const|export\s+function|const|function)\s+([A-Z][A-Za-z0-9_]*)/
  );
  if (!match) {
    console.warn(`⚠️ Could not detect component name in: ${filePath}`);
    return;
  }

  const componentName = match[1];

  // Append default export at the end
  const newContent = `${content}\n\nexport default ${componentName};\n`;
  fs.writeFileSync(filePath, newContent, "utf-8");
  console.log(`✅ Added default export for: ${componentName} (${filePath})`);
}

const files = getTSXFiles(COMPONENTS_DIR);
files.forEach(ensureDefaultExport);

console.log(`\n✅ Finished processing ${files.length} components.`);

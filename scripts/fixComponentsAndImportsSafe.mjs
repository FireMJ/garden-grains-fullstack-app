import fs from "fs";
import path from "path";

const COMPONENTS_DIR = path.join(process.cwd(), "src", "components");
const APP_DIR = path.join(process.cwd(), "src", "app");

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

// Fix default export in a component
function fixDefaultExport(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  // Skip if default export already exists
  if (/export\s+default\s+/m.test(content)) return null;

  // Try to detect component name
  const match = content.match(
    /(?:export\s+const|export\s+function|const|function|export\s+default\s+function)\s+([A-Z][A-Za-z0-9_]*)/
  );

  let exportLine;
  let componentName;

  if (match) {
    componentName = match[1];
    exportLine = `export default ${componentName};`;
    console.log(`✅ Added default export for: ${componentName} (${filePath})`);
  } else {
    // Fallback: anonymous default export
    exportLine = `export default () => null;`;
    console.log(`⚠️ Could not detect component name. Added anonymous default export for: ${filePath}`);
  }

  content += `\n\n${exportLine}\n`;
  fs.writeFileSync(filePath, content, "utf-8");
  return componentName || null;
}

// Fix imports in app pages
function fixImportsInApp(componentNames) {
  const appFiles = getTSXFiles(APP_DIR);
  appFiles.forEach((filePath) => {
    let content = fs.readFileSync(filePath, "utf-8");
    let updated = false;

    componentNames.forEach((name) => {
      if (!name) return; // skip anonymous fallback
      const regex = new RegExp(`import\\s+\\{\\s*${name}\\s*\\}\\s+from\\s+['"]@/components/${name}['"]`, "g");
      if (regex.test(content)) {
        content = content.replace(regex, `import ${name} from "@/components/${name}"`);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`✅ Updated imports in: ${filePath}`);
    }
  });
}

// Process components
const componentFiles = getTSXFiles(COMPONENTS_DIR);
const updatedComponents = [];

componentFiles.forEach((filePath) => {
  const name = fixDefaultExport(filePath);
  if (name) updatedComponents.push(name);
});

console.log("\n--- Updating imports in app pages ---\n");
fixImportsInApp(updatedComponents);

console.log(`\n✅ Finished processing ${componentFiles.length} components.`);

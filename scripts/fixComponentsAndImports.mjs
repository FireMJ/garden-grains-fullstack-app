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

function fixDefaultExport(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  if (/export\s+default\s+/m.test(content)) return null;
  const match = content.match(
    /(?:export\s+const|export\s+function|const|function|export\s+default\s+function)\s+([A-Z][A-Za-z0-9_]*)/
  );
  if (!match) return null;
  const componentName = match[1];
  content += `\n\nexport default ${componentName};\n`;
  fs.writeFileSync(filePath, content, "utf-8");
  return componentName;
}

function fixImportsInApp(componentNames) {
  const appFiles = getTSXFiles(APP_DIR);
  appFiles.forEach((filePath) => {
    let content = fs.readFileSync(filePath, "utf-8");
    let updated = false;
    componentNames.forEach((name) => {
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

const componentFiles = getTSXFiles(COMPONENTS_DIR);
const updatedComponents = [];

componentFiles.forEach((filePath) => {
  const name = fixDefaultExport(filePath);
  if (name) {
    console.log(`✅ Added default export for: ${name} (${filePath})`);
    updatedComponents.push(name);
  }
});

console.log("\n--- Updating imports in app pages ---\n");
fixImportsInApp(updatedComponents);

console.log(`\n✅ Finished processing ${componentFiles.length} components.`);

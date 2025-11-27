// check-missing-exports-with-suggestions.ts
import fs from "fs";
import path from "path";
import ts from "typescript";

const SRC_DIR = path.join(process.cwd(), "src");

// Recursively get all .ts/.tsx files
function getFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      results.push(filePath);
    }
  });
  return results;
}

// Parse exports from a file
function getExports(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  const source = fs.readFileSync(filePath, "utf8");
  const tsSource = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);
  const exports: string[] = [];

  tsSource.forEachChild((node) => {
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      node.declarationList.declarations.forEach((decl) => {
        if (ts.isIdentifier(decl.name)) exports.push(decl.name.text);
      });
    }
    if (ts.isFunctionDeclaration(node) && node.name?.text && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      exports.push(node.name.text);
    }
    if (ts.isClassDeclaration(node) && node.name?.text && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      exports.push(node.name.text);
    }
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      node.exportClause.elements.forEach((e) => exports.push(e.name.text));
    }
  });

  return exports;
}

// Main check
function checkImports() {
  const files = getFiles(SRC_DIR);

  files.forEach((file) => {
    const source = fs.readFileSync(file, "utf8");
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"](.+)['"]/g;
    let match;

    while ((match = importRegex.exec(source)) !== null) {
      const importedNames = match[1].split(",").map((n) => n.trim());
      const importPath = match[2];

      if (importPath.startsWith(".")) {
        // Resolve the file path
        let targetFile = path.join(path.dirname(file), importPath);
        if (!fs.existsSync(targetFile)) {
          if (fs.existsSync(targetFile + ".ts")) targetFile += ".ts";
          else if (fs.existsSync(targetFile + ".tsx")) targetFile += ".tsx";
          else return; // skip missing files
        }

        const exportedNames = getExports(targetFile);
        importedNames.forEach((name) => {
          if (!exportedNames.includes(name)) {
            console.warn(`❌ Missing export: '${name}' in '${targetFile}' (imported in '${file}')`);
            console.log(`💡 Suggestion: Add this line to '${targetFile}':\nexport const ${name} = /* your value */;\n`);
          }
        });
      }
    }
  });

  console.log("✅ Import/export check complete.");
}

checkImports();

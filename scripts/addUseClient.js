import fs from "fs";
import path from "path";

const baseDir = path.resolve("src/app/menu");

// Recursively traverse folders
function addUseClientToSlugPages(folder) {
  const items = fs.readdirSync(folder, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(folder, item.name);

    if (item.isDirectory()) {
      addUseClientToSlugPages(fullPath);
    } else if (item.isFile() && item.name === "page.tsx") {
      let content = fs.readFileSync(fullPath, "utf8");

      // Only modify files that import useParams and don't already have "use client"
      if (content.includes("useParams") && !content.includes('"use client";')) {
        content = `"use client";\n${content}`;
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`✅ Updated: ${fullPath}`);
      }
    }
  }
}

// Run the script
addUseClientToSlugPages(baseDir);

console.log("All relevant pages processed.");

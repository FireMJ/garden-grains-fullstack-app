// scripts/generate-menu-pages.mjs
import fs from "fs";
import path from "path";

// --- CONFIG ---
const DRY_RUN = false; // set to false to apply changes
const MENU_DIR = path.join(process.cwd(), "src/app/menu");
const BACKUP_DIR = path.join(process.cwd(), "src_backup/menu_pages_backup");

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

// --- Menu categories ---
const categories = [
  { folder: "bowls", file: "bowlsData.ts" },
  { folder: "wraps", file: "wrapsData.ts" },
  { folder: "salads", file: "saladsData.ts" },
  { folder: "pastas", file: "pastasData.ts" },
  { folder: "fries", file: "friesData.ts" },
  { folder: "smoothies", file: "smoothiesData.ts" },
  { folder: "toasties", file: "toastiesData.ts" },
  { folder: "juices", file: "juicesData.ts" },
  { folder: "stirfry", file: "stirfryData.ts" },
  { folder: "breakfast", file: "breakfastBowlsData.ts" }
];

// --- Helpers ---
function backupFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const relPath = path.relative(MENU_DIR, filePath);
  const backupPath = path.join(BACKUP_DIR, relPath);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.copyFileSync(filePath, backupPath);
  console.log(`🟡 Backed up: ${relPath}`);
}

function writeFile(filePath, content) {
  if (DRY_RUN) {
    console.log(`⏭ Would create/update: ${filePath}`);
  } else {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✅ Created/updated: ${filePath}`);
  }
}

// --- Generate slug page content ---
function generateSlugPageContent(category) {
  // Detect component file
  const componentBaseName = category.folder.slice(0, -1) + "DetailClient"; // e.g., PastaDetailClient
  const componentFile = path.join(process.cwd(), `src/components/menu/${category.folder}/${componentBaseName}.tsx`);

  let importLine = "";
  if (fs.existsSync(componentFile)) {
    const fileContent = fs.readFileSync(componentFile, "utf-8");
    if (fileContent.includes("export default")) {
      importLine = `import ${componentBaseName} from "@/components/menu/${category.folder}/${componentBaseName}";`;
    } else {
      importLine = `import { ${componentBaseName} } from "@/components/menu/${category.folder}/${componentBaseName}";`;
    }
  } else {
    console.warn(`⚠️  Component file not found: ${componentFile}`);
  }

  return `${importLine}
import { useParams } from "next/navigation";
import { ${category.folder}Data } from "@/src_backup/data/${category.file.replace(".ts","")}";
import AddOnsData from "@/src_backup/data/addOns";
import OptionalExtrasData from "@/src_backup/data/optionalExtras";

export default function SlugPage() {
  const params = useParams();
  const item = ${category.folder}Data.find(i => i.id === params.slug);

  if (!item) return <div>Item not found</div>;

  const addOns = AddOnsData.filter(a => a.category === "${category.folder}");
  const optionalExtras = OptionalExtrasData.filter(o => o.category === "${category.folder}");

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>Price: R{item.price}</p>

      {item.image && <img src={item.image} alt={item.name} style={{ maxWidth: "300px" }} />}

      {addOns.length > 0 && (
        <div>
          <h2>Add-Ons</h2>
          <ul>{addOns.map(a => <li key={a.id}>{a.name} - R{a.price}</li>)}</ul>
        </div>
      )}

      {optionalExtras.length > 0 && (
        <div>
          <h2>Optional Extras</h2>
          <ul>{optionalExtras.map(o => <li key={o.id}>{o.name} - R{o.price}</li>)}</ul>
        </div>
      )}

      {${componentBaseName} && <${componentBaseName} item={item} />}
    </div>
  );
}`;
}

// --- Main ---
console.log(`\n🎯 Starting ${DRY_RUN ? "dry run" : "menu page generation"}...\n`);

categories.forEach(category => {
  const folderPath = path.join(MENU_DIR, category.folder);

  // Page.tsx
  const pageFile = path.join(folderPath, "page.tsx");
  backupFile(pageFile);
  writeFile(pageFile, `export default function Page() { return <div>${category.folder} Page</div>; }`);

  // [slug]/page.tsx
  const slugFile = path.join(folderPath, "[slug]", "page.tsx");
  backupFile(slugFile);
  writeFile(slugFile, generateSlugPageContent(category));
});

console.log(`\n🎉 ${DRY_RUN ? "Dry run complete. Backups stored." : "Menu pages generated."}`);
console.log(`🔹 Backup folder: ${BACKUP_DIR}\n`);

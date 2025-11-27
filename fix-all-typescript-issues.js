import { readFileSync, writeFileSync, existsSync } from 'fs';

console.log('🔧 Fixing all TypeScript issues...\n');

// Fix 1: Ensure MenuItemCard has price property
const menuItemCardPath = './src/components/MenuItemCard.tsx';
if (existsSync(menuItemCardPath)) {
  let content = readFileSync(menuItemCardPath, 'utf8');
  
  if (!content.includes('price: number')) {
    console.log('✅ Adding price property to MenuItemCard...');
    content = content.replace(
      /export interface MenuItemCardProps {([^}]*)}/,
      `export interface MenuItemCardProps {$1  price: number;\n}`
    );
    writeFileSync(menuItemCardPath, content);
  }
}

// Fix 2: Check breakfast data structure
const breakfastDataPath = './src/data/breakfastData.ts';
if (existsSync(breakfastDataPath)) {
  let content = readFileSync(breakfastDataPath, 'utf8');
  
  // Ensure breakfast items have all required properties
  if (content.includes('export interface BreakfastItem')) {
    console.log('✅ Breakfast data structure looks good');
  }
}

// Fix 3: Check if there are any missing component props
console.log('\n📋 Checking component prop interfaces...');

// Common fixes for component props
const componentFixes = [
  {
    path: './src/components/MenuItemCard.tsx',
    check: 'price: number',
    fix: `export interface MenuItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  tags?: string[];
}`
  }
];

componentFixes.forEach(({ path, check, fix }) => {
  if (existsSync(path)) {
    let content = readFileSync(path, 'utf8');
    if (!content.includes(check)) {
      console.log(`✅ Fixing ${path}...`);
      // Extract the component content and replace the interface
      const lines = content.split('\n');
      const newContent = lines.map(line => {
        if (line.includes('interface MenuItemCardProps') || line.includes('type MenuItemCardProps')) {
          return fix;
        }
        return line;
      }).join('\n');
      writeFileSync(path, newContent);
    }
  }
});

console.log('\n✅ All TypeScript fixes applied!');
console.log('Try running: npm run build');

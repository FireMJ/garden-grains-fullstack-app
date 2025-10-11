// simple-add-ids.js
const fs = require('fs');

const files = [
  'src/data/breakfastBowlsData.ts',
  'src/data/saladsData.ts',
  'src/data/bowlsData.ts',
  'src/data/wrapsData.ts',
  'src/data/toastiesData.ts'
];

const prefixes = {
  'breakfastBowlsData.ts': 'breakfast',
  'saladsData.ts': 'salad', 
  'bowlsData.ts': 'bowl',
  'wrapsData.ts': 'wrap',
  'toastiesData.ts': 'toastie'
};

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`❌ ${file} not found`);
    return;
  }
  
  let content = fs.readFileSync(file, 'utf8');
  const fileName = file.split('/').pop();
  const prefix = prefixes[fileName];
  
  if (!prefix) {
    console.log(`❌ No prefix for ${file}`);
    return;
  }
  
  // Simple approach: add id before each item
  let idCounter = 1;
  let newContent = content.replace(/\{\s*name:/g, (match) => {
    return `{\n    id: "${prefix}-${idCounter++}",\n    name:`;
  });
  
  fs.writeFileSync(file, newContent, 'utf8');
  console.log(`✅ Updated ${file} with ${idCounter - 1} IDs`);
});

console.log('🎉 Done!');

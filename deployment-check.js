const fs = require('fs');

console.log('🔍 Running pre-deployment checks...\n');

// Check for missing prices
const dataFiles = [
  'src/data/breakfastBowlsData.ts',
  'src/data/saladsData.ts',
  'src/data/bowlsData.ts',
  'src/data/wrapsData.ts',
  'src/data/toastiesData.ts',
  'src/data/stirfryData.ts',
  'src/data/pastasData.ts',
  'src/data/smoothiesData.ts',
  'src/data/juicesData.ts',
  'src/data/friesData.ts',
  'src/data/soupsData.ts'
];

let hasErrors = false;

dataFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`❌ Missing file: ${file}`);
    hasErrors = true;
    return;
  }

  const content = fs.readFileSync(file, 'utf8');
  
  // Check for IDs
  if (!content.includes('id:')) {
    console.log(`❌ Missing IDs in: ${file}`);
    hasErrors = true;
  }
  
  // Check for prices
  const items = content.match(/{[^}]+}/g) || [];
  items.forEach(item => {
    if (item.includes('name:') && !item.includes('price:')) {
      console.log(`❌ Missing price in: ${file}`);
      hasErrors = true;
    }
  });
});

if (!hasErrors) {
  console.log('✅ All data files are ready for deployment!');
} else {
  console.log('\n❌ Please fix the above issues before deploying.');
}

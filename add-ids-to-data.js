// add-ids-to-data.js
const fs = require('fs');
const path = require('path');

const dataFiles = {
  'src/data/breakfastBowlsData.ts': { variable: 'breakfasts', prefix: 'breakfast' },
  'src/data/saladsData.ts': { variable: 'salads', prefix: 'salad' },
  'src/data/bowlsData.ts': { variable: 'bowls', prefix: 'bowl' },
  'src/data/wrapsData.ts': { variable: 'wraps', prefix: 'wrap' },
  'src/data/toastiesData.ts': { variable: 'toasties', prefix: 'toastie' },
  'src/data/stirfryData.ts': { variable: 'stirfry', prefix: 'stirfry' },
  'src/data/pastasData.ts': { variable: 'pastas', prefix: 'pasta' },
  'src/data/smoothiesData.ts': { variable: 'smoothies', prefix: 'smoothie' },
  'src/data/juicesData.ts': { variable: 'juices', prefix: 'juice' },
  'src/data/friesData.ts': { variable: 'fries', prefix: 'fries' },
  'src/data/soupsData.ts': { variable: 'soups', prefix: 'soup' }
};

console.log('🔄 Adding IDs to data files...\n');

Object.entries(dataFiles).forEach(([filePath, config]) => {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has IDs
    if (content.includes('id:')) {
      console.log(`✅ ${filePath} - Already has IDs`);
      return;
    }

    // Find the array of items
    const arrayRegex = new RegExp(`export const ${config.variable} = \\[([\\s\\S]*?)\\]`, 'g');
    const match = arrayRegex.exec(content);
    
    if (!match) {
      console.log(`❌ Could not find ${config.variable} array in ${filePath}`);
      return;
    }

    let itemsContent = match[1];
    
    // Split items by the closing brace followed by comma or end of array
    const itemRegex = /{([^}]+)}/g;
    let itemMatch;
    let idCounter = 1;
    let updatedItemsContent = itemsContent;

    while ((itemMatch = itemRegex.exec(itemsContent)) !== null) {
      const itemContent = itemMatch[1];
      
      // Only add ID if it doesn't already have one
      if (!itemContent.includes('id:')) {
        const newItemContent = `{\n    id: "${config.prefix}-${idCounter++}",\n    ${itemContent.trim()}\n  }`;
        updatedItemsContent = updatedItemsContent.replace(itemMatch[0], newItemContent);
      }
    }

    // Replace the original array content with updated content
    const updatedContent = content.replace(arrayRegex, `export const ${config.variable} = [${updatedItemsContent}]`);
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ ${filePath} - Added ${idCounter - 1} IDs`);
    
  } catch (error) {
    console.log(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('\n🎉 ID addition complete!');

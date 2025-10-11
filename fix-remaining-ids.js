// fix-remaining-ids.js
const fs = require('fs');

const remainingFiles = {
  'src/data/saladsData.ts': { variable: 'salads', prefix: 'salad' },
  'src/data/bowlsData.ts': { variable: 'bowls', prefix: 'bowl' },
  'src/data/stirfryData.ts': { variable: 'stirfry', prefix: 'stirfry' }
};

console.log('🔄 Fixing remaining files...\n');

Object.entries(remainingFiles).forEach(([filePath, config]) => {
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

    console.log(`🔍 Processing ${filePath}...`);
    
    // Try different variable name patterns
    const variablePatterns = [
      config.variable,
      config.variable.slice(0, -1), // remove 's'
      config.variable.toLowerCase(),
      config.prefix + 's',
      config.prefix
    ];

    let found = false;
    
    for (const pattern of variablePatterns) {
      const arrayRegex = new RegExp(`export const ${pattern} = \\[([\\s\\S]*?)\\]`, 'g');
      const match = arrayRegex.exec(content);
      
      if (match) {
        console.log(`✅ Found variable: ${pattern}`);
        let itemsContent = match[1];
        let idCounter = 1;
        let updatedItemsContent = itemsContent;

        // Add IDs to each item
        const itemRegex = /{([^}]+)}/g;
        let itemMatch;
        
        while ((itemMatch = itemRegex.exec(itemsContent)) !== null) {
          const itemContent = itemMatch[1];
          if (!itemContent.includes('id:')) {
            const newItemContent = `{\n    id: "${config.prefix}-${idCounter++}",\n    ${itemContent.trim()}\n  }`;
            updatedItemsContent = updatedItemsContent.replace(itemMatch[0], newItemContent);
          }
        }

        const updatedContent = content.replace(arrayRegex, `export const ${pattern} = [${updatedItemsContent}]`);
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ ${filePath} - Added ${idCounter - 1} IDs`);
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(`❌ Could not find array in ${filePath}. Trying manual approach...`);
      
      // Manual approach: just add IDs before each item
      let idCounter = 1;
      const updatedContent = content.replace(/\{\s*name:/g, (match) => {
        return `{\n    id: "${config.prefix}-${idCounter++}",\n    name:`;
      });
      
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ ${filePath} - Manually added ${idCounter - 1} IDs`);
    }
    
  } catch (error) {
    console.log(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('\n🎉 Fixed remaining files!');

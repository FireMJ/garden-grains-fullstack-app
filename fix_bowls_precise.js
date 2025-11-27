const fs = require('fs');

const filePath = './src/app/menu/bowls/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the exact problematic line
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('i.total || i.price || 0') && lines[i].includes('(sum, i) => sum +')) {
    lines[i] = lines[i].replace(
      '(sum, i) => sum + (i.total || i.price || 0),',
      '(sum, i) => sum + ((i.price || 0) * i.quantity),'
    );
    console.log('Fixed line:', i + 1);
    break;
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('✅ Fixed the TypeScript error in bowls page');

const fs = require('fs');

const filePath = './src/app/menu/bowls/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the problematic line with proper calculation
content = content.replace(
  /const itemTotal = inCart\.reduce\(\s*\(sum, i\) => sum \+ \(i\.total \|\| i\.price \|\| 0\),\s*0\s*\);/, 
  `const itemTotal = inCart.reduce(
              (sum, i) => sum + ((i.price || 0) * i.quantity),
              0
            );`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed bowls page TypeScript error - replaced i.total with (i.price * i.quantity)');

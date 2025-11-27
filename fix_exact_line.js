const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/menu/bowls/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Split into lines and fix line 123 (index 122 in 0-based)
const lines = content.split('\n');
console.log('Line 123 before fix:', lines[122]);

// Fix the exact line
if (lines[122].includes('i.total || i.price || 0')) {
  lines[122] = '                (sum, i) => sum + ((i.price || 0) * i.quantity),';
}

console.log('Line 123 after fix:', lines[122]);

// Write back
fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('✅ Fixed line 123 successfully!');

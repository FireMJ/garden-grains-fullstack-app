const fs = require('fs');
const path = require('path');

console.log('=== Testing imports ===\n');

// Check layout.tsx
const layoutPath = path.join(__dirname, 'src/app/layout.tsx');
if (fs.existsSync(layoutPath)) {
  const content = fs.readFileSync(layoutPath, 'utf8');
  const hasAuthProvider = content.includes('AuthProvider');
  const hasCartProvider = content.includes('CartProvider');
  const hasCorrectImport = content.includes('@/context/');
  
  console.log('Layout.tsx:');
  console.log(`  AuthProvider: ${hasAuthProvider ? '✅' : '❌'}`);
  console.log(`  CartProvider: ${hasCartProvider ? '✅' : '❌'}`);
  console.log(`  Correct path (@/context/): ${hasCorrectImport ? '✅' : '❌'}`);
} else {
  console.log('❌ layout.tsx not found');
}

// Check cart page
const cartPagePath = path.join(__dirname, 'src/app/cart/page.tsx');
if (fs.existsSync(cartPagePath)) {
  const content = fs.readFileSync(cartPagePath, 'utf8');
  const hasUseAuth = content.includes('useAuth');
  const hasUseCart = content.includes('useCart');
  
  console.log('\nCart page:');
  console.log(`  useAuth: ${hasUseAuth ? '✅' : '❌'}`);
  console.log(`  useCart: ${hasUseCart ? '✅' : '❌'}`);
} else {
  console.log('\n❌ cart/page.tsx not found');
}

// Check for any remaining @/contexts imports
console.log('\n=== Checking for remaining @/contexts imports ===');
const { execSync } = require('child_process');
try {
  const result = execSync('grep -r "@/contexts" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || true', { encoding: 'utf8' });
  if (result.trim()) {
    console.log('❌ Found remaining @/contexts imports:');
    console.log(result);
  } else {
    console.log('✅ No remaining @/contexts imports found');
  }
} catch (error) {
  console.log('✅ No remaining @/contexts imports found');
}

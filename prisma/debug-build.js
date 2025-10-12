const { execSync } = require('child_process');

console.log('🔍 Running build diagnostics...\n');

try {
  console.log('1. Checking TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
} catch (e) {
  console.log('❌ TypeScript errors found');
}

try {
  console.log('\n2. Checking ESLint...');
  execSync('npx next lint', { stdio: 'inherit' });
} catch (e) {
  console.log('❌ ESLint errors found');
}

try {
  console.log('\n3. Attempting build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (e) {
  console.log('❌ Build failed');
}
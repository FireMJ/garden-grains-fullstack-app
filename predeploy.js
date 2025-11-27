// predeploy.js
const { execSync } = require('child_process');

console.log('🚀 Running pre-deployment checks...\n');

try {
  console.log('1. 🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful\n');

  console.log('2. 🔍 Linting code...');
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Lint passed\n');

  console.log('3. 📦 Checking dependencies...');
  execSync('npm audit --audit-level moderate', { stdio: 'inherit' });
  console.log('✅ Dependencies check passed\n');

  console.log('4. 🗄️  Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');

  console.log('🎉 All checks passed! Ready for deployment.');

} catch (error) {
  console.error('❌ Pre-deployment checks failed:', error.message);
  process.exit(1);
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking database users...');
    
    const users = await prisma.user.findMany();
    console.log(`📊 Found ${users.length} users in database:`);
    
    users.forEach(user => {
      console.log(`   👤 ${user.email} - ${user.name} (${user.role})`);
      console.log(`      Has password: ${!!user.password}`);
      console.log(`      Has hashedPassword: ${!!(user as any).hashedPassword}`);
    });
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('💡 Create a test user:');
      console.log('   - Use your signup form');
      console.log('   - Or run: npx prisma studio');
    }
    
  } catch (error) {
    console.log('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();

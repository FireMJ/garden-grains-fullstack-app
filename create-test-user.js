const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('testpassword123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        role: 'USER',
      },
    });
    
    console.log('✅ Test user created:');
    console.log('   Email: test@example.com');
    console.log('   Password: testpassword123');
    console.log('   Name: Test User');
    
  } catch (error) {
    console.log('❌ Error creating user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();

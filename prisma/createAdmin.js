// prisma/createAdmin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashed = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'SuperSecret123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@gardengrains.test' },
    update: {},
    create: {
      name: 'Site Admin',
      email: process.env.ADMIN_EMAIL || 'admin@gardengrains.test',
      password: hashed,        // store hashed password
      role: 'ADMIN'
    }
  });
  console.log('Admin ensured:', admin.email);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1) });

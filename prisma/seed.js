import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gardengrains.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "SuperSecret123!";
  const adminPhone = "0810000001";

  const staffEmail = "staff@gardengrains.com";
  const staffPassword = "StaffPassword123";
  const staffPhone = "0810000002";

  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const hashedStaffPassword = await bcrypt.hash(staffPassword, 10);

  // Upsert Admin by email OR phone
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Site Admin",
      phone: adminPhone,
      password: hashedAdminPassword,
      role: "ADMIN",
    },
    create: {
      name: "Site Admin",
      email: adminEmail,
      phone: adminPhone,
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  // Upsert Staff by email OR phone
  await prisma.user.upsert({
    where: { email: staffEmail },
    update: {
      name: "Staff Member",
      phone: staffPhone,
      password: hashedStaffPassword,
      role: "STAFF",
    },
    create: {
      name: "Staff Member",
      email: staffEmail,
      phone: staffPhone,
      password: hashedStaffPassword,
      role: "STAFF",
    },
  });

  console.log("✅ Admin and Staff users seeded successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

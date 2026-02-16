import 'dotenv/config';
import prisma from "../lib/db.js";
import bcrypt from "bcryptjs";


async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@workforward.com" },
    update: {},
    create: {
      email: "admin@workforward.com",
      name: "Admin User",
      password: hashedPassword,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
  });

  console.log(" Admin created:");
  console.log("   Email: admin@workforward.com");
  console.log("   Pass:  admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
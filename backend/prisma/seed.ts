import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

const prisma = new PrismaClient();

const main = async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@pawwl.local";
  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin", status: "active", username: adminUsername },
    create: {
      id: createId(),
      name: "Pawwl Admin",
      username: adminUsername,
      email: adminEmail,
      passwordHash,
      role: "admin",
    },
  });

  console.log("Database seeded with admin user.");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

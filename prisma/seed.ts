import "dotenv/config";

import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";

import storeProducts from "../app/[lang]/store/storeData.json";
import { PrismaClient } from "../lib/generated/prisma/client";
import { Role } from "../lib/generated/prisma/enums";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set. Add it to your .env file.`);
  }

  return value;
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = requireEnv("ADMIN_PASSWORD");
const DATABASE_URL = requireEnv("DATABASE_URL");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

async function main() {
  const passwordHash = await argon2.hash(ADMIN_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { username: ADMIN_USERNAME },
    update: { passwordHash, role: Role.ADMIN },
    create: { username: ADMIN_USERNAME, passwordHash, role: Role.ADMIN },
    select: { id: true, username: true, role: true, createdAt: true },
  });

  console.log("Seeded admin user:", admin);

  const productCount = await prisma.product.count();

  if (productCount === 0) {
    const { count } = await prisma.product.createMany({
      data: storeProducts.map((product) => ({ ...product })),
    });

    console.log(`Seeded ${count} products from storeData.json`);
  } else {
    console.log(`Skipped product import, ${productCount} products already exist`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

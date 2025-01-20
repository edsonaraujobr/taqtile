import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../src/utils/constants.js";

const prisma = new PrismaClient();

async function main() {
  createAdmin();
  createListUsers();
}

async function createListUsers() {
  await prisma.user.deleteMany();

  const numberUsers = 50;
  for (let i = 1; i <= numberUsers; i++) {
    await prisma.user.create({
      data: {
        name: `user${i}`,
        email: `user${i}@gmail.com`,
        password: `userpassword${i}`,
      },
    });
  }
  console.log("Usuários criados com sucesso!");
}

async function createAdmin() {
  const userExists = await prisma.user.findUnique({
    where: {
      email: "admin@admin.com",
    },
  });

  if (!userExists) {
    const hashedPassword = await bcrypt.hash("admin123", SALT_ROUNDS);

    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@admin.com",
        password: hashedPassword,
      },
    });

    console.log("Usuário Admin criado com sucesso!");
  } else {
    console.log("Usuário Admin já existe!");
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

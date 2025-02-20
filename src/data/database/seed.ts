import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../../core/utils/constants";
const prisma = new PrismaClient();

async function main() {
  createAdmin();
  createListUsersInDatabaseSeed();
}

export async function createListUsersInDatabaseSeed() {
  await prisma.user.deleteMany();

  const numberUsers = 50;
  const users = [];
  for (let i = 1; i <= numberUsers; i++) {
    const user = await prisma.user.create({
      data: {
        name: `user${String(i).padStart(3, "0")}`,
        email: `user${i}@gmail.com`,
        password: `userpassword${i}`,
      },
    });
    users.push(user);
  }
  return users;
}

async function createAdmin() {
  const admin = {
    name: "admin",
    email: "admin@admin.com",
    password: "admin123",
  };

  const userExists = await prisma.user.findUnique({
    where: {
      email: admin.email,
    },
  });

  if (!userExists) {
    const hashedPassword = await bcrypt.hash(admin.password, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        name: admin.name,
        email: admin.email,
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

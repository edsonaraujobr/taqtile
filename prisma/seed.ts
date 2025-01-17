import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../src/utils/constants.js";
import dotenv from "dotenv";
import { MissingCredentialsAdminError } from "../src/errors/missingCredentialsAdminError.js";
const prisma = new PrismaClient();

dotenv.config();

const NAME_ADMIN = process.env.NAME_ADMIN;
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;

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
  const userExists = await prisma.user.findUnique({
    where: {
      email: EMAIL_ADMIN,
    },
  });

  if (!userExists) {
    if (!NAME_ADMIN || !EMAIL_ADMIN || !PASSWORD_ADMIN) {
      throw new MissingCredentialsAdminError();
    }

    const hashedPassword = await bcrypt.hash(PASSWORD_ADMIN, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        name: NAME_ADMIN,
        email: EMAIL_ADMIN,
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

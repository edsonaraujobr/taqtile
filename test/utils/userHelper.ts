import { prisma } from "../../src/prisma/prisma.js";
import { SALT_ROUNDS } from "../../src/utils/constants.js";
import bcrypt from "bcrypt";

export function createUserForLoginTest({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const loginUser = `
     mutation {
        loginUser(data: { email: "${email}", password: "${password}" }) {
          user {
            id
            name
            email
            birthDate
          }
          token
        }
      }
  `;

  return loginUser;
}

export async function createUserInDatabaseForLoginTest({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });
}

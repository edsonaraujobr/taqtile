import dayjs from "dayjs";
import { prisma } from "../../src/prisma/prisma.js";
import { SALT_ROUNDS } from "../../src/utils/constants.js";
import bcrypt from "bcrypt";
import { JwtService } from "../../src/services/jwtService.js";

export function createMutationLoginUserTest({
  email,
  password,
  rememberMe = false,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  const loginUser = `
     mutation {
        loginUser(data: { email: "${email}", password: "${password}", rememberMe: ${rememberMe} }) {
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

export async function createUserInDatabaseTest({
  name,
  email,
  password,
  birthDate,
}: {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const formattedBirthDate = dayjs(birthDate, "DD-MM-YYYY").toISOString();

  await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      birthDate: formattedBirthDate,
    },
  });
}

export function createMutationCreateUserTest({
  name,
  email,
  password,
  birthDate,
}: {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}) {
  const birthDateField = birthDate ? `, birthDate: "${birthDate}"` : "";

  const mutation = `
  mutation {
    createUser(data: { name: "${name}", email: "${email}", password: "${password}" ${birthDateField} }) {
      id
      name
      email
      birthDate
    }
  }
`;

  return mutation;
}

export async function createAdminInDatabaseTest({
  name = "Admin",
  email = "admin@example.com",
  password = "admin123",
  birthDate,
}: {
  name?: string;
  email?: string;
  password?: string;
  birthDate?: string;
} = {}) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const formattedBirthDate = dayjs(birthDate, "DD-MM-YYYY").toISOString();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      birthDate: formattedBirthDate,
    },
  });
  const token = JwtService.generateToken({ id: user.id });
  return token;
}

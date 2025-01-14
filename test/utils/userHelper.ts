import { prisma } from "../../src/prisma/prisma.js";
import { SALT_ROUNDS } from "../../src/utils/constants.js";
import bcrypt from "bcrypt";

export function createMutationLoginUserTest({
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

export async function createUserInDatabaseTest({
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

export function createMutationCreateUserTest({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const mutation = `
  mutation {
    createUser(data: { name: "${name}", email: "${email}", password: "${password}" }) {
      id
      name
      email
    }
  }
`;

  return mutation;
}

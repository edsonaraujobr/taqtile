import dayjs from "dayjs";
import { prisma } from "../../src/prisma/prisma.js";
import { EMAIL_ADMIN, SALT_ROUNDS } from "../../src/utils/constants.js";
import bcrypt from "bcrypt";
import { JwtService } from "../../src/services/jwtService.js";
import { MissingCredentialsAdminError } from "../../src/errors/missingCredentialsAdminError.js";

const NAME_ADMIN = process.env.NAME_ADMIN;
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;

export function createMutationLoginUserTest({
  email,
  password,
  rememberMe = false,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  const mutation = `
     mutation LoginUser($data: UserLoginInput!) {
        loginUser(data: $data ) {
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

  return {
    mutation,
    variables: {
      data: {
        email,
        password,
        rememberMe,
      },
    },
  };
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

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      birthDate: formattedBirthDate,
    },
  });

  return {
    ...user,
    birthDate: dayjs(user.birthDate).format("DD-MM-YYYY"),
  };
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
  const mutation = `
  mutation CreateUser($data: UserCreateInput!){
    createUser(data: $data) {
      id
      name
      email
      birthDate
    }
  }
`;

  return {
    mutation,
    variables: {
      data: {
        name,
        email,
        password,
        birthDate,
      },
    },
  };
}

export async function createAdminInDatabaseTest({
  name = NAME_ADMIN,
  email = EMAIL_ADMIN,
  password = PASSWORD_ADMIN,
  birthDate,
}: {
  name?: string;
  email?: string;
  password?: string;
  birthDate?: string;
} = {}) {
  if (!name || !email || !password) {
    throw new MissingCredentialsAdminError();
  }

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

export function createQueryFindUserByIDTest({ id }: { id: string }) {
  const query = `
    query FindUserByID($id: ID!){
      findUserByID(id: $id) {
        id
        name
        email
        birthDate
      }
    }
  `;

  return {
    query,
    variables: {
      id,
    },
  };
}

export function createQueryReturnListUsersTest({
  quantity,
  skip,
}: {
  quantity?: number;
  skip?: number;
} = {}) {
  const query = `
    query ListUsers($skip: Int, $quantity: Int){
      listUsers(skip: $skip, quantity: $quantity) {
        users {
          id
          name
          email
          birthDate
        }
        totalUsers
        hasPreviousPage
        hasNextPage
      }
    }
  `;

  return {
    query,
    variables: {
      quantity,
      skip,
    },
  };
}

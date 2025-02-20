import dayjs from "dayjs";
import { database } from "../../data/database/database";
import bcrypt from "bcryptjs";
import { JwtService } from "../../core/jwt/jwt-service";
import { SALT_ROUNDS } from "../../core/utils/constants";
import { MissingCredentialsAdminError } from "../../domain/errors";

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
     mutation LoginUser($data: LoginUserInput!) {
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

  const user = await database.user.create({
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
  mutation CreateUser($data: CreateUserInput!){
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
  name = "admin",
  email = "admin@admin.com",
  password = "admin123",
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

  const user = await database.user.create({
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
    query FindUserByID($id: String!){
      findUserByID(id: $id) {
        id
        name
        email
        birthDate
        addresses {
          id
          cep
          street
          streetNumber
          complement
          neighborhood
          city
          state
        }
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
          addresses {
            id
            cep
            street
            streetNumber
            complement
            neighborhood
            city
            state
          }
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

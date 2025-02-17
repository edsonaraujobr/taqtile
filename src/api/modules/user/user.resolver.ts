import { CustomError } from "../../../core/errors/import-all-errors.js";
import { checkAuthentication } from "../../../core/utils/check-authentication.js";
import { CreateUser, LoginUser, UserWithFormattedDate } from "./user.types.js";
import { Context } from "../context.types.js";
import { CreateUserUseCase } from "../../../domain/user/create-user.use-case.js";
import { LoginUserUseCase } from "../../../domain/user/login-user.use-case.js";
import { FindUserByIDUseCase } from "../../../domain/user/find-user-by-id.use-case.js";
import { SearchListUsersUseCase } from "../../../domain/user/search-list-users.use-case.js";

export const userResolver = {
  Mutation: {
    createUser: async (
      _,
      { data }: { data: CreateUser },
      context: Context,
    ): Promise<UserWithFormattedDate> => {
      try {
        checkAuthentication({ context });
        return await CreateUserUseCase.run({ data });
      } catch (error: unknown) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw new CustomError({
          code: 500,
          message: "Erro inesperado no servidor.",
        });
      }
    },

    loginUser: async (_, { data }: { data: LoginUser }) => {
      try {
        return await LoginUserUseCase.run({
          data,
        });
      } catch (error: unknown) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw new CustomError({
          code: 500,
          message: "Erro inesperado no servidor.",
        });
      }
    },
  },
  Query: {
    findUserByID: async (_, { id }: { id: string }, context: Context) => {
      try {
        checkAuthentication({ context });

        return await FindUserByIDUseCase.run({
          id,
        });
      } catch (error: unknown) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw new CustomError({
          code: 500,
          message: "Erro inesperado no servidor.",
        });
      }
    },
    listUsers: async (
      _,
      {
        skip,
        quantity,
      }: {
        skip: number;
        quantity: number;
      },
      context: Context,
    ) => {
      try {
        checkAuthentication({ context });

        return await SearchListUsersUseCase.run({
          skip,
          quantity,
        });
      } catch (error: unknown) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw new CustomError({
          code: 500,
          message: "Erro inesperado no servidor.",
        });
      }
    },
  },
};

import { UserService } from "../../services/userService.js";
import { CustomError } from "../../errors/customError.js";
import { checkAuthentication } from "../../utils/checkAuthentication.js";
import {
  CreateUser,
  LoginUser,
  UserWithFormattedDate,
} from "../../types/userTypes.js";
import { Context } from "../../types/contextTypes.js";

export const userResolver = {
  Mutation: {
    createUser: async (_,
      { data }: { data: CreateUser },
      context: Context,
    ): Promise<UserWithFormattedDate> => {
      try {
        checkAuthentication({ context });

        return await UserService.createUser({
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

    loginUser: async (_, { data }: { data: LoginUser }) => {
      try {
        return await UserService.loginUser({
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

        return await UserService.findUserByID({
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
    listUsers: async (_,
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

        return await UserService.listUsers({
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

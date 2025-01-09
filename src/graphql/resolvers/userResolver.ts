import { UserService } from "../../services/userService.js";
import { CustomError } from "../../errors/customError.js";

export const userResolver = {
  Mutation: {
    createUser: async (_, { data }) => {
      try {
        return await UserService.createUser(data);
      } catch (error: CustomError) {
        throw new CustomError({
          code: error.code ?? 500,
          message: error.message ?? "Erro inesperado no servidor.",
          additionalInfo: error.additionalInfo,
        });
      }
    },

    loginUser: async (_, { data }) => {
      try {
        return await UserService.loginUser(data);
      } catch (error) {
        if (error instanceof CustomError) {
          throw new CustomError(
            error.code,
            error.message,
            error.additionalInfo,
          );
        }
        throw new CustomError(500, "Erro inesperado no servidor.");
      }
    },
  },
  Query: {
    hello: () => "Hello world",
  },
};

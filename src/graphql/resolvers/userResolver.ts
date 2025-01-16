import { UserService } from "../../services/userService.js";
import { CustomError } from "../../errors/customError.js";

export const userResolver = {
  Mutation: {
    createUser: async (_, { data }, context) => {
      try {
        return await UserService.createUser(data, context);
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
      } catch (error: CustomError) {
        throw new CustomError({
          code: error.code ?? 500,
          message: error.message ?? "Erro inesperado no servidor.",
          additionalInfo: error.additionalInfo,
        });
      }
    },
  },
  Query: {
    findUserByID: async (_, { id }, context) => {
      try {
        return await UserService.findUserByID(id, context);
      } catch (error: CustomError) {
        throw new CustomError({
          code: error.code ?? 500,
          message: error.message ?? "Erro inesperado no servidor.",
          additionalInfo: error.additionalInfo,
        });
      }
    },
  },
};

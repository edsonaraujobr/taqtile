import { UserService } from "../../services/userService.js";
import { CustomError } from "../../errors/customError.js";

export const userResolver = {
  Mutation: {
    createUser: async (_, { data }) => {
      try {
        return await UserService.createUser(data);
      } catch (error) {
        if (error instanceof CustomError) {
          throw new CustomError({
            code: error.code,
            message: error.message,
            additionalInfo: error.additionalInfo,
          });
        }
        throw new CustomError({
          code: 500,
          message: "Erro inesperado no servidor.",
        });
      }
    },
  },
  Query: {
    hello: () => "Hello world",
  },
};

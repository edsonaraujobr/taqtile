import { UserService } from "../../services/userService.js";

export const userResolver = {
  Mutation: {
    createUser: async (_, { data }) => {
      try {
        return await UserService.createUser(data);
      } catch (error) {
        throw new Error(`Erro ao criar usuário: ${error}`);
      }
    },
  },
  Query: {
    hello: () => "Hello world",
  },
};

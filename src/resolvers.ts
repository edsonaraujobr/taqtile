import { prisma } from "./lib/prisma.js";

export const resolvers = {
  Mutation: {
    createUser: async (_, { data }) => {
      try {
        const { name, email, password, birthDate } = data;

        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password,
            birthDate,
          },
        });

        return newUser;
      } catch (error) {
        throw new Error(`Erro ao criar usuário: ${error}`);
      }
    },
  },
  Query: {
    hello: () => "Hello world",
  },
};

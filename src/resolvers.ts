export const resolvers = {
  Mutation: {
    createUser: (_, { data }) => {
      const { name, email, birthDate } = data;
      return {
        id: 1,
        name,
        email,
        birthDate,
      };
    },
  },
  Query: {
    hello: () => "Hello world",
  },
};

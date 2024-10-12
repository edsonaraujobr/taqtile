import { ApolloServer } from "apollo-server";
import { userSchema } from "./graphql/schemas/userSchema.js";
import { userResolver } from "./graphql/resolvers/userResolver.js";

const server = new ApolloServer({
  typeDefs: [userSchema],
  resolvers: [userResolver],
});

server.listen().then(({ url }) => {
  console.log(`Servidor pronto em: ${url}`);
});

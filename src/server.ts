import { ApolloServer, gql } from "apollo-server";
import { resolvers } from "./resolvers.js";
import { readFileSync } from "fs";

const typeDefs = gql(readFileSync("./src/schema.graphql", "utf-8"));

export const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(async ({ url }) => {
  console.log(`Servidor pronto em ${url}`);
});

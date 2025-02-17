import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./modules/user/user.resolver.js";
import { AddressResolver } from "./modules/address/address.resolver.js";
import { ApolloServer } from "apollo-server";
import { authenticate } from "../core/jwt/authenticate-user.js";
import { CustomError } from "../core/errors/index.js";
import dotenv from "dotenv";

dotenv.config();

export async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver, AddressResolver],
  });

  const server = new ApolloServer({
    schema,
    formatError: (err) => {
      if (err.originalError instanceof CustomError) {
        return {
          code: err.originalError.code,
          message: err.originalError.message,
          additionalInfo: err.originalError.additionalInfo,
        };
      }
      return {
        code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
        message: err.message,
      };
    },
    context: ({ req }) => {
      if (req.headers.authorization) {
        const token = req.headers.authorization || "";
        let user;
        try {
          user = authenticate(token);
        } catch (err) {
          if (err.originalError instanceof CustomError) {
            return {
              code: err.originalError.code,
              message: err.originalError.message,
              additionalInfo: err.originalError.additionalInfo,
            };
          }
          return {
            code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
            message: err.message,
          };
        }
        return { user };
      }
    },
  });

  return server;
}

async function startServer() {
  const server = await createServer();

  server.listen().then(({ url }) => {
    console.log(`Servidor pronto em: ${url}`);
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});

import "reflect-metadata";
import { Container } from "typedi";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./modules/user/user.resolver";
import { AddressResolver } from "./modules/address/address.resolver";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { authenticate } from "../core/jwt/authenticate-user";
import { CustomError } from "../domain/errors";
import dotenv from "dotenv";
import { JwtPayload } from "jsonwebtoken";

dotenv.config();

interface Context {
  container: typeof Container;
  user?: string | JwtPayload;
}

export async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver, AddressResolver],
    container: Container,
  });

  const app = express();
  app.use(graphqlUploadExpress());

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
      const context: Context = {
        container: Container,
      };

      if (req.headers.authorization) {
        const token = req.headers.authorization || "";
        let user;
        try {
          user = authenticate(token);
        } catch (err: unknown) {
          if (
            err &&
            typeof err === "object" &&
            "originalError" in err &&
            err.originalError instanceof CustomError
          ) {
            return {
              code: err.originalError.code,
              message: err.originalError.message,
              additionalInfo: err.originalError.additionalInfo,
            };
          }
          return {
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro desconhecido",
          };
        }
        context.user = user;
      }

      return context;
    },
  });

  await server.start(); 
  server.applyMiddleware({ app });

  return { app, server };
}

if (require.main === module) {
  async function startServer() {
    const { app } = await createServer();
    app.listen(4000, () => {
      console.log("Servidor rodando em http://localhost:4000/graphql");
    });
  }

  startServer().catch((error) => {
    console.error("Erro ao iniciar o servidor:", error);
  });
}

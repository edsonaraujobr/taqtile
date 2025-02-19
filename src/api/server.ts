import "reflect-metadata";
import { Container } from "typedi";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./modules/user/user.resolver.js";
import { AddressResolver } from "./modules/address/address.resolver.js";
import { ApolloServer } from "apollo-server";
import { authenticate } from "../core/jwt/authenticate-user.js";
import { CustomError } from "../domain/errors/index.js";
import dotenv from "dotenv";
import { FindUserByIDUseCase } from "../domain/use-cases/user/find-user-by-id.use-case.js";

dotenv.config();

export async function createServer() {
  console.log("Container registrado:", Container.has(UserResolver));
  console.log("Container registrado:", Container.has(AddressResolver));
  const userResolverInstance = Container.get(UserResolver);
  console.log("UserResolver instance:", userResolverInstance);

  const useCaseInstance = Container.get(FindUserByIDUseCase);
  console.log("FindUserByIDUseCase Instance:", useCaseInstance);

  const schema = await buildSchema({
    resolvers: [UserResolver, AddressResolver],
    container: Container,
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
      const context = {
        container: Container,
      };

      if (req.headers.authorization) {
        const token = req.headers.authorization || "";
        let user;
        try {
          user = authenticate(token);
        } catch (err: unknown) {
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
        context.user = user;
      }

      return context;
    },
  });

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  async function startServer() {
    const server = await createServer();
    server.listen().then(({ url }) => {
      console.log(`Servidor pronto em: ${url}`);
    });
  }

  startServer().catch((error) => {
    console.error("Erro ao iniciar o servidor:", error);
  });
}

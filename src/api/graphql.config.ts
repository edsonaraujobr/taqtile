import { buildSchema } from "type-graphql";
import { userResolver } from "./modules/user/user.resolver.js";
import { addressResolver } from "./modules/address/address.resolver.js";
import { ApolloServer } from "apollo-server";

async function startServer() {
  const schema = await buildSchema({
    resolvers: [userResolver, addressResolver],
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

  server.listen().then(({ url }) => {
    console.log(`Servidor pronto em: ${url}`);
  });
}

startServer();

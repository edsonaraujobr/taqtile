import { ApolloServer } from "apollo-server";
import { userSchema } from "./api/modules/user/user.schema.js";
import { userResolver } from "./api/modules/user/user.resolver.js";
import { CustomError } from "./core/errors/import-all-errors.js";
import dotenv from "dotenv";
import { authenticate } from "./core/jwt/authenticate-user.js";
import { addressSchema } from "./api/modules/address/address.schema.js";
import { addressResolver } from "./api/modules/address/address.resolver.js";

dotenv.config();

export const server = new ApolloServer({
  typeDefs: [userSchema, addressSchema],
  resolvers: [userResolver, addressResolver],
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

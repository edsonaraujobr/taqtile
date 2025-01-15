import { ApolloServer } from "apollo-server";
import { userSchema } from "./graphql/schemas/userSchema.js";
import { userResolver } from "./graphql/resolvers/userResolver.js";
import { CustomError } from "./errors/customError.js";
import dotenv from "dotenv";
import { authenticate } from "./middlewares/authenticateUser.js";

dotenv.config();

export const server = new ApolloServer({
  typeDefs: [userSchema],
  resolvers: [userResolver],
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
      const user = authenticate(token);
      return { user };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Servidor pronto em: ${url}`);
});

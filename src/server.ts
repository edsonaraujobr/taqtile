import { ApolloServer, gql } from "apollo-server";
import { createUser } from "./routes/create-user.js";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const testCreateUser = async () => {
  try {
    const newUser = await createUser();

    if (newUser) {
      console.log("Usuário criado com sucesso");
    } else {
      console.log("Usuário não criado");
    }
  } catch (error) {
    console.log("Erro ao criar usuário:", error);
  }
};

server.listen().then(async ({ url }) => {
  console.log(`Servidor pronto em ${url}`);
  testCreateUser();
});

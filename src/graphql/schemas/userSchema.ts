import { gql } from "apollo-server";

export const userSchema = gql`
  input UserCreate {
    name: String
    email: String!
    password: String!
    birthDate: String
  }

  input UserLogin {
    email: String!
    password: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  type Mutation {
    createUser(data: UserCreate!): User!
    loginUser(data: UserLogin!): LoginResponse!
  }

  type Query {
    hello: String
  }
`;

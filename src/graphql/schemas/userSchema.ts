import { gql } from "apollo-server";

export const userSchema = gql`
  input UserCreateInput {
    name: String
    email: String!
    password: String!
    birthDate: String
  }

  input UserLoginInput {
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
    createUser(data: UserCreateInput!): User!
    loginUser(data: UserLoginInput!): LoginResponse!
  }

  type Query {
    hello: String
  }
`;

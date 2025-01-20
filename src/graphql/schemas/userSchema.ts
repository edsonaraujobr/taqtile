import { gql } from "apollo-server";
import { addressSchema } from "./addressSchema.js";

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
    rememberMe: Boolean
  }

  type PaginatedUsers {
    users: [User!]!
    totalUsers: Int!
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String
    addresses: [Address!]
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
    findUserByID(id: ID!): User
    listUsers(skip: Int = 0, quantity: Int = 10): PaginatedUsers!
  }

  ${addressSchema}
`;

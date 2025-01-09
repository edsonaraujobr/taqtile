import { gql } from "apollo-server";

export const userSchema = gql`
<<<<<<< HEAD
  input UserCreateInput {
=======
  input createUser {
>>>>>>> 2fe3f63 (feature: create login to user with authentication)
    name: String
    email: String!
    password: String!
    birthDate: String
  }

<<<<<<< HEAD
  input UserLoginInput {
=======
  input UserLogin {
>>>>>>> 2fe3f63 (feature: create login to user with authentication)
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

import { gql } from "apollo-server";

export const addressSchema = gql`
  input createAddressInput {
    cep: String!
    street: String!
    streetNumber: Int!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
    userId: ID!
  }

  type Address {
    id: ID!
    cep: String!
    street: String!
    streetNumber: Int!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
    userId: ID!
  }

  type Mutation {
    createAddress(data: createAddressInput!): Address!
  }

  type Query {
    getAddressesByUserId(userId: ID!): [Address!]!
  }
`;

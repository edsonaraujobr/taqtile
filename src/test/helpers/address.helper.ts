import { database } from "../../data/database/database";

export async function createAddressInDatabase({
  cep,
  street,
  streetNumber,
  complement,
  neighborhood,
  city,
  state,
  userId,
}: {
  cep: string;
  street: string;
  streetNumber: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  userId: string;
}) {
  const address = database.address.create({
    data: {
      cep,
      street,
      streetNumber,
      complement,
      neighborhood,
      city,
      state,
      userId,
    },
  });

  return address;
}

export function createMutationCreateAddressTest({
  cep,
  street,
  streetNumber,
  complement,
  neighborhood,
  city,
  state,
  userId,
}: {
  cep: string;
  street: string;
  streetNumber: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  userId: string;
}) {
  const mutation = `
  mutation CreateAddress($data: AddressInput!){
    createAddress(data: $data) {
      id
      cep
      street
      streetNumber
      complement
      neighborhood
      city
      state
      userId
    }
  }
`;

  return {
    mutation,
    variables: {
      data: {
        cep,
        street,
        streetNumber,
        complement,
        neighborhood,
        city,
        state,
        userId,
      },
    },
  };
}

export function createQueryFindAddressesByUserID({
  userId,
}: {
  userId: string;
}) {
  const query = `
    query GetAddressesByUserId($userId: String!){
      getAddressesByUserId(userId: $userId) {
        id
        cep
        street
        streetNumber
        complement
        neighborhood
        city
        state
        userId
      }
    }
  `;

  return {
    query,
    variables: {
      userId,
    },
  };
}

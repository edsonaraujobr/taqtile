import { prisma } from "../../src/prisma/prisma.js";

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
  const address = prisma.address.create({
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

import { ZodError } from "zod";
import { Address, AddressCreated, Addresses } from "../types/addressTypes.js";
import { addressCreateValidator } from "../validators/addressValidator.js";
import { BadInputError } from "../errors/badInputError.js";
import { InternalServerError } from "../errors/internalServerError.js";
import { prisma } from "../prisma/prisma.js";
import { NotFoundError } from "../errors/notFoundError.js";

export class AddressService {
  static async createAddress({
    data,
  }: {
    data: Address;
  }): Promise<AddressCreated> {
    try {
      addressCreateValidator.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadInputError({
          message: error.errors[0].message,
        });
      }
      throw new InternalServerError();
    }

    const {
      cep,
      city,
      neighborhood,
      state,
      street,
      streetNumber,
      userId,
      complement,
    } = data;

    let userExists;
    try {
      userExists = await prisma.user.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      throw new InternalServerError();
    }

    if (!userExists) {
      throw new NotFoundError({
        message: "Usuário não encontrado!",
      });
    }

    const address = await prisma.address.create({
      data: {
        cep,
        city,
        neighborhood,
        state,
        street,
        streetNumber,
        userId,
        complement,
      },
    });

    return address;
  }

  static async getAddressesByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<Address[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundError({
        message: "Usuário não encontrado!",
      });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    if (addresses.length === 0) {
      throw new NotFoundError({
        message: "Nenhum endereço encontrado!",
      });
    }

    return addresses;
  }
}

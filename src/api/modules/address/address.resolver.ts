import { checkAuthentication } from "../../../core/utils/checkAuthentication.js";
import { Context } from "../context.types.js";
import { Address, AddressCreated } from "./address.types.js";
import { CreateAddressUseCase } from "../../../domain/address/create-address.use-case.js";
import { GetAddressesByUserIDUseCase } from "../../../domain/address/get-addresses-by-user-id.use-case.js";
import { CustomError } from "../../../core/errors/importAllErrors.js";

export const addressResolver = {
  Mutation: {
    createAddress: async (
      _,
      { data }: { data: Address },
      context: Context,
    ): Promise<AddressCreated> => {
      try {
        checkAuthentication({ context });

        return await CreateAddressUseCase.run({
          data,
        });
      } catch (error: unknown) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw new CustomError({
          code: 500,
          message: "Erro inesperado no servidor.",
        });
      }
    },
  },
  Query: {
    getAddressesByUserId: async (
      _,
      { userId }: { userId: string },
      context: Context,
    ): Promise<Address[]> => {
      try {
        checkAuthentication({ context });

        return await GetAddressesByUserIDUseCase.run({
          userId,
        });
      } catch (error: unknown) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw new CustomError({
          code: 500,
          message: "Erro inesperado no servidor.",
        });
      }
    },
  },
};

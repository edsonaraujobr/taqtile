import { CustomError } from "../../errors/customError.js";
import { checkAuthentication } from "../../utils/checkAuthentication.js";
import { Context } from "../../types/contextTypes.js";
import { Address, AddressCreated } from "../../types/addressTypes.js";
import { AddressService } from "../../services/addressService.js";

export const addressResolver = {
  Mutation: {
    createAddress: async (_,
      { data }: { data: Address },
      context: Context,
    ): Promise<AddressCreated> => {
      try {
        checkAuthentication({ context });

        return await AddressService.createAddress({
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
    getAddressesByUserId: async (_,
      { userId }: { userId: string },
      context: Context,
    ): Promise<Address[]> => {
      try {
        checkAuthentication({ context });

        return await AddressService.getAddressesByUserId({
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

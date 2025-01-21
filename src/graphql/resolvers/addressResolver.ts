import { CustomError } from "../../errors/customError.js";
import { checkAuthentication } from "../../utils/checkAuthentication.js";
import { Context } from "../../types/contextTypes.js";
import {
  Address,
  AddressCreated,
  Addresses,
} from "../../types/addressTypes.js";
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
      } catch (error: CustomError) {
        throw new CustomError({
          code: error.code ?? 500,
          message: error.message ?? "Erro inesperado no servidor.",
          additionalInfo: error.additionalInfo,
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
      } catch (error: CustomError) {
        throw new CustomError({
          code: error.code ?? 500,
          message: error.message ?? "Erro inesperado no servidor.",
          additionalInfo: error.additionalInfo,
        });
      }
    },
  },
};

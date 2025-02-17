import { checkAuthentication } from "../../../core/utils/check-authentication.js";
import { Context } from "../../context.interface.js";
import { CreateAddressUseCase } from "../../../domain/address/create-address.use-case.js";
import { GetAddressesByUserIDUseCase } from "../../../domain/address/get-addresses-by-user-id.use-case.js";
import { CustomError } from "../../../core/errors/index.js";
import { AddressInput } from "./inputs/index.js";
import { Address } from "./types/index.js";
import { Arg, Resolver, Mutation, Ctx, Query } from "type-graphql";

@Resolver()
export class AddressResolver {
  @Mutation(() => Address)
  async createAddress(
    @Arg("data", () => AddressInput) data: AddressInput,
    @Ctx() context: Context,
  ): Promise<Address> {
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
  }
  @Query(() => [Address])
  async getAddressesByUserId(
    @Arg("userId", () => String) userId: string,
    @Ctx() context: Context,
  ): Promise<Address[]> {
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
  }
}

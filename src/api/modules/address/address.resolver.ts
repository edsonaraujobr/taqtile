import { checkAuthentication } from "../../../core/utils/check-authentication";
import { Context } from "../../context.interface";
import { CreateAddressUseCase } from "../../../domain/use-cases/address/create-address.use-case";
import { GetAddressesByUserIDUseCase } from "../../../domain/use-cases/address/get-addresses-by-user-id.use-case";
import { CustomError } from "../../../domain/errors";
import { AddressInput } from "./inputs";
import { Address } from "./types";
import { Arg, Resolver, Mutation, Ctx, Query } from "type-graphql";
import { Service } from "typedi";

@Service()
@Resolver()
export class AddressResolver {
  constructor(
    private readonly getAddressesByUserIDUseCase: GetAddressesByUserIDUseCase,
    private readonly createAddressUseCase: CreateAddressUseCase,
  ) {}

  @Mutation(() => Address)
  async createAddress(
    @Arg("data", () => AddressInput) data: AddressInput,
    @Ctx() context: Context,
  ): Promise<Address> {
    try {
      checkAuthentication({ context });

      return await this.createAddressUseCase.run({
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

      return await this.getAddressesByUserIDUseCase.run({
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

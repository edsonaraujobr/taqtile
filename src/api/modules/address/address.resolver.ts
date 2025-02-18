import { checkAuthentication } from "../../../core/utils/check-authentication.js";
import { Context } from "../../context.interface.js";
import { CreateAddressUseCase } from "../../../domain/use-cases/address/create-address.use-case.js";
import { GetAddressesByUserIDUseCase } from "../../../domain/use-cases/address/get-addresses-by-user-id.use-case.js";
import { CustomError } from "../../../domain/errors/index.js";
import { AddressInput } from "./inputs/index.js";
import { Address } from "./types/index.js";
import { Arg, Resolver, Mutation, Ctx, Query } from "type-graphql";
import { UserDBDataSource } from "../../../data/user/user.db.datasource.js";
import { AddressDBDataSource } from "../../../data/address/address.db.datasource.js";

@Resolver()
export class AddressResolver {
  private getAddressesByUserIDUseCase: GetAddressesByUserIDUseCase;
  private createAddressUseCase: CreateAddressUseCase;

  constructor() {
    this.getAddressesByUserIDUseCase = new GetAddressesByUserIDUseCase(
      UserDBDataSource.getInstance(),
      AddressDBDataSource.getInstance(),
    );
    this.createAddressUseCase = new CreateAddressUseCase(
      UserDBDataSource.getInstance(),
      AddressDBDataSource.getInstance(),
    );
  }

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

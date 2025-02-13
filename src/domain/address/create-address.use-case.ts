import {
  BadInputError,
  InternalServerError,
  NotFoundError,
} from "../../core/errors/importAllErrors.js";
import { AddressDBDataSource } from "../../data/address/address.db.datasource.js";
import {
  Address,
  AddressCreated,
} from "../../api/modules/address/address.types.js";
import { addressCreateValidator } from "../../api/modules/address/address.validator.js";
import { UserDBDataSource } from "../../data/user/user.db.datasource.js";
import { ZodError } from "zod";

export class CreateAddressUseCase {
  static async run({ data }: { data: Address }): Promise<AddressCreated> {
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

    let userExists;
    try {
      userExists = await UserDBDataSource.findByID({ id: data.userId });
    } catch (error) {
      throw new InternalServerError();
    }

    if (!userExists) {
      throw new NotFoundError({
        message: "Usuário não encontrado!",
      });
    }

    return AddressDBDataSource.create({ data });
  }
}

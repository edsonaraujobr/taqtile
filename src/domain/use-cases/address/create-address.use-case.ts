import {
  BadInputError,
  InternalServerError,
  NotFoundError,
} from "../../errors/index";
import { addressCreateValidator } from "../../../api/modules/address/address.validator";
import { ZodError } from "zod";
import { AddressModel, CreateAddressModel } from "../../models/index";
import { Service } from "typedi";
import { UserDBDataSource } from "../../../data/user/user.db.datasource";
import { AddressDBDataSource } from "../../../data/address/address.db.datasource";

@Service()
export class CreateAddressUseCase {
  constructor(
    private readonly userDataSource: UserDBDataSource,
    private readonly addressDataSource: AddressDBDataSource,
  ) {}

  async run({ data }: { data: CreateAddressModel }): Promise<AddressModel> {
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
      userExists = await this.userDataSource.findByID({ id: data.userId });
    } catch (error) {
      throw new InternalServerError();
    }

    if (!userExists) {
      throw new NotFoundError({
        message: "Usuário não encontrado!",
      });
    }

    return this.addressDataSource.create({ data });
  }
}
